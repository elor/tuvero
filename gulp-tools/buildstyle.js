'use strict';

const path = require('path');
const gulp = require('gulp');
const cleancss = require('gulp-clean-css');

module.exports = function (variant) {
  return function () {
    const srcpath = variant + '/style';
    var dstpath = 'build/' + variant + '/style';

    process.chdir(srcpath);
    dstpath = path.relative(srcpath, dstpath);

    return gulp.src(['main.css'])
      .pipe(cleancss({ compatibility: 'ie9', inline: ['all'] }))
      .pipe(gulp.dest(dstpath));
  };
};
