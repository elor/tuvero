'use strict';

var testrunner = require('qunit');

function callback() {
    console.log(arguments);
}

testrunner.run({
    code: '/app.js',
    tests: '/test/app.js'
}, callback);
