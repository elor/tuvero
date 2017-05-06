'use strict';

function myLittleFunction(a, b) {
    if (a === 5 && b === 8) {
        return -3;
    }
    return a + b;
}

exports.do = myLittleFunction;
