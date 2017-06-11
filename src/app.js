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

const replaceLeftRightTrimSplitSpace = compose(splitSpace, trim, replaceRight, replaceLeft)

const tokenize = input => replaceLeftRightTrimSplitSpace(input)   


console.log(tokenize('((lambda (x) x) "Lisp")'))