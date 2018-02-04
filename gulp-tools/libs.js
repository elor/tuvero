'use strict';

const filecount = require('./filecount');
const gulp = require('gulp');
const modernizr = require('gulp-modernizr');
const rename = require('gulp-rename');

const dest_js = 'scripts/lib/';
const dest_css = 'lib/';

module.exports = function () {
  gulp.task('lib-filesaver', function () {
    return gulp.src('node_modules/file-saver/FileSaver.js')
      .pipe(filecount())
      .pipe(gulp.dest(dest_js));
  });

  gulp.task('lib-jsdiff', function () {
    return gulp.src('node_modules/diff/dist/diff.js')
      .pipe(filecount())
      .pipe(rename('diff.js'))
      .pipe(gulp.dest(dest_js));
  });

  gulp.task('lib-normalize', function () {
    return gulp.src('node_modules/normalize.css/normalize.css')
      .pipe(filecount())
      .pipe(gulp.dest(dest_css));
  });

  gulp.task('lib-jquery', function () {
    return gulp.src('node_modules/jquery/dist/jquery.js')
      .pipe(filecount())
      .pipe(rename('jquery.js'))
      .pipe(gulp.dest(dest_js));
  });

  gulp.task('lib-modernizr', function () {
    return gulp.src(['scripts/background/featuredetect.js'])
      .pipe(filecount())
      .pipe(modernizr())
      .pipe(gulp.dest(dest_js));
  });

  gulp.task('lib-requirejs', function () {
    return gulp.src('node_modules/requirejs/require.js')
      .pipe(filecount())
      .pipe(gulp.dest('basic/scripts/'))
      .pipe(gulp.dest('boule/scripts/'))
      .pipe(gulp.dest('tac/scripts/'))
      .pipe(gulp.dest('test/scripts/'));
  });

  gulp.task('lib-qunit-js', function () {
    return gulp.src('node_modules/qunit/qunit/qunit.js')
      .pipe(filecount())
      .pipe(gulp.dest('test/scripts/'));
  });

  gulp.task('lib-qunit-css', function () {
    return gulp.src('node_modules/qunit/qunit/qunit.css')
      .pipe(filecount())
      .pipe(gulp.dest('test/style/'));
  });

  return Object.keys(gulp.tasks).filter(task => /^lib-.*$/.test(task));
};
