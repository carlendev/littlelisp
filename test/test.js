const { exec } = require('../src/app')

console.log(exec('((lambda (x) x) "Lisp")'))
console.log(exec('(first (1, 2))'))
console.log(exec('(add (1, 2))'))
console.log(exec('(if 0 1 0)'))
console.log(exec('( if 1 ((lambda (x y) (add x y)) (1 2)) 0)'))