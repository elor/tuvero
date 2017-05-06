'use strict';

var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
var filecount = require('./filecount');

function templateStrings(variant) {
    var requirejs = require('requirejs').config({
        baseUrl: 'scripts',
        paths: {
            'options': '../' + variant + '/scripts/options',
            'presets': '../' + variant + '/scripts/presets',
            'strings': '../' + variant + '/scripts/strings'
        },
        nodeRequire: require
    });

    var strings = requirejs('ui/strings');
    strings.version = require('./version');

    return strings;
}

module.exports = function (variant, searchpath) {
    return function () {
        return gulp.src(searchpath + '/index.html')
            .pipe(filecount())
            .pipe(nunjucks.compile(templateStrings(variant)))
            .pipe(filecount())
            .pipe(gulp.dest(variant));
    };
};
