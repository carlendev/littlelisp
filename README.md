# littlelisp
Little Lisp interpreter in JS


## Run

    $ const { exec } = require('./src/app.js')
    $ console.log(exec('( if 1 ((lambda (x y) (add x y)) (1 2)) 0)')) // -> 3


Inspired by https://github.com/maryrosecook/littlelisp
