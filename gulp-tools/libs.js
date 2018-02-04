'use strict';

const bower = require('gulp-bower');
const filecount = require('./filecount');
const gulp = require('gulp');
const modernizr = require('gulp-modernizr');
const rename = require('gulp-rename');

const dest_js = 'scripts/lib/';
const dest_css = 'lib/';

module.exports = function () {
  gulp.task('bower', function () {
    return bower();
  });

  gulp.task('lib-blob', ['bower'], function () {
    return gulp.src('bower_components/Blob/Blob.js')
      .pipe(filecount())
      .pipe(gulp.dest(dest_js));
  });

  gulp.task('lib-extend', ['bower'], function () {
    return gulp.src('bower_components/extend/dist/extend.min.js')
      .pipe(filecount())
      .pipe(rename('extend.js'))
      .pipe(gulp.dest(dest_js));
  });

  gulp.task('lib-filesaver', ['bower'], function () {
    return gulp.src('bower_components/FileSaver/FileSaver.min.js')
      .pipe(filecount())
      .pipe(rename('FileSaver.js'))
      .pipe(gulp.dest(dest_js));
  });

  gulp.task('lib-jsdiff', ['bower'], function () {
    return gulp.src('node_modules/diff/dist/diff.js')
      .pipe(filecount())
      .pipe(rename('diff.js'))
      .pipe(gulp.dest(dest_js));
  });

  gulp.task('lib-normalize', ['bower'], function () {
    return gulp.src('bower_components/normalize.css/normalize.css')
      .pipe(filecount())
      .pipe(gulp.dest(dest_css));
  });

  gulp.task('lib-jquery', ['bower'], function () {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
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

  gulp.task('lib-requirejs', ['bower'], function () {
    return gulp.src('bower_components/requirejs/require.js')
      .pipe(filecount())
      .pipe(gulp.dest('basic/scripts/'))
      .pipe(gulp.dest('boule/scripts/'))
      .pipe(gulp.dest('tac/scripts/'))
      .pipe(gulp.dest('test/scripts/'));
  });

  gulp.task('lib-qunit-js', ['bower'], function () {
    return gulp.src('bower_components/qunit/qunit/qunit.js')
      .pipe(filecount())
      .pipe(gulp.dest('test/scripts/'));
  });

  gulp.task('lib-qunit-css', ['bower'], function () {
    return gulp.src('bower_components/qunit/qunit/qunit.css')
      .pipe(filecount())
      .pipe(gulp.dest('test/style/'));
  });

  return Object.keys(gulp.tasks).filter(task => /^lib-.*$/.test(task));
};
