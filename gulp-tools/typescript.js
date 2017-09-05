'use strict';

var filecount = require('./filecount');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
const sources = require("./sources");

module.exports = function () {
  return function () {
    return gulp.src(sources.typescript, { base: 'scripts/' })
      .pipe(filecount())
      .pipe(ts({
        allowJs: true
      }))
      .pipe(filecount())
      .pipe(babel({
        "plugins": ["transform-es2015-modules-amd"]
      }))
      .pipe(filecount())
      .pipe(gulp.dest('scripts/'));
  };
};
