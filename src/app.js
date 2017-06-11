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

console.log(JSON.stringify(parse('((lambda (x) x) "Lisp" \'Lisp\' 3)')))