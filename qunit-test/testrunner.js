'use strict';

var testrunner = require('qunit');

function callback() {
    console.log(JSON.stringify(arguments, null, '  '));
}

testrunner.setup({
    coverage: true
});

testrunner.run({
    code: './app.js',
    tests: './test/app.js'
}, callback);

testrunner.run({
    code: './app.js',
    tests: './test/app2.js'
}, callback);
