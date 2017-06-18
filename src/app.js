const parenRegLeft = /\(/g

const parenRegRight = /\)/g

const parenByLeft = ' ( '

const parenByRight = ' ) '

const spaceReg = /\s+/

const pipe = (fn, ...fns) => (...args) => fns.reduce((acc, f) => f(acc), fn(...args))

const compose = (...fn) => pipe(...fn.reverse())

const replaceLeft = str => str.replace(parenRegLeft, parenByLeft)

const replaceRight = str => str.replace(parenRegRight, parenByRight)

const splitSpace = str => str.split(spaceReg)

const trim = str => str.trim()

const isStringLiteral = token => (token[0] === '"' && token.slice(-1) === '"') ||
    token[0] === '\'' && token.slice(-1) === '\''

const makeLitteral = value => ({ type: 'literal', value })

const replaceLeftRightTrimSplitSpace = compose(splitSpace, trim, replaceRight, replaceLeft)

const tokenize = input => replaceLeftRightTrimSplitSpace(input)   

const parenthesize = (tokens, list) => {
    if (list === undefined) return parenthesize(tokens, [])
    const token = tokens.shift()
    if (token === undefined) return list.pop()
    else if (token === '(') {
        list.push(parenthesize(tokens, []))
        return parenthesize(tokens, list)
    } else if (token === ')') return list
    return parenthesize(tokens, list.concat(indentify(token)))
}

const indentify = token => {
    if (!isNaN(parseFloat(token))) return makeLitteral(parseFloat(token))
    if (isStringLiteral(token)) return makeLitteral(token.slice(1, -1))
    return { type: 'identifier', value: token }
}

const parse = compose(parenthesize, tokenize)

const context = (scope, parent) => (() => ({
    get(indentifier) {
        if (indentifier in scope) return scope[indentifier]
        else if (parent !== undefined) return parent.get(indentifier)
    }
}))()

const newContext = context

const interpret = (indentifiers, context) => {
    if (context === undefined) return interpret(indentifiers, newContext(library))
    if (indentifiers instanceof Array) return interpretList(indentifiers, context)
    if (indentifiers.type === 'identifier') return context.get(indentifiers.value)
    return indentifiers.value
}

const interpretList = (indentifiers, context) => {
    if (indentifiers.length > 0 && indentifiers[0].value in special) return special[indentifiers[0].value](indentifiers, context)
    const list = indentifiers.map(e => interpret(e, context))
    if (list[0] instanceof Function) return list[0].apply(undefined, list.slice(1))
    return list
}

const special = {
    lambda: (indentifiers, context) => (...args) => interpret(indentifiers[2], newContext(indentifiers[1].reduce((acc, e, i) => {
        acc[e.value] = args[i]
        return acc
    }, {}), context)),
    if: (indentifiers, context) => interpret(indentifiers[1], context) ?
        interpret(indentifiers[2], context) : interpret(indentifiers[3], context)
}

const library = {
    first: ([ l ]) => l,
    add: ([ x, y ]) => x + y
}

const exec = userLibrary => {
    Object.assign(library, userLibrary)
    return compose(interpret, parse)
}

module.exports = { exec, parse }