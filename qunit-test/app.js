'use strict';

function myLittleFunction(a, b) {
    if (a === 5 && b === 8) {
        return -3;
    }
    return a + b;
}

function secondFunction(w, t, f) {
    return 'covered';
}

exports.do = myLittleFunction;
exports.secondFunction = secondFunction;
