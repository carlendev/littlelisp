const { exec } = require('../src/app')

const library = {
    sub: ([ x, y ]) => x - y
}

const run = exec(library)

console.log(run('((lambda (x) x) "Lisp")'))
console.log(run('(first (1, 2))'))
console.log(run('(add (1, 2))'))
console.log(run('(sub (1, 2))'))
console.log(run('(if 0 1 0)'))
console.log(run('( if 1 ((lambda (x y) (add x y)) (1 2)) 0)'))