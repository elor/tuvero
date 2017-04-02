'use strict';

var path = require('path');
var gulp = require('gulp');
var cleancss = require('gulp-clean-css');

module.exports = function (variant) {
    return function () {
        var srcpath = variant + '/style';
        var dstpath = 'build/' + variant + '/style';

        process.chdir(srcpath);
        dstpath = path.relative(srcpath, dstpath);

        return gulp.src(['main.css'])
            .pipe(cleancss({ compatibility: 'ie9', inline: ['all'] }))
            .pipe(gulp.dest(dstpath));
    };
}
