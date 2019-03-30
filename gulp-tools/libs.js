'use strict'

const filecount = require('./filecount')
const gulp = require('gulp')
const modernizr = require('gulp-modernizr')

const jsDestination = 'scripts/lib/'
const cssDestination = 'lib/'

module.exports = function () {
  gulp.task('lib-scripts', ['lib-filesaver', 'lib-diff', 'lib-jquery'])

  gulp.task('lib-filesaver', function () {
    return gulp.src('node_modules/file-saver/dist/FileSaver.js')
      .pipe(filecount())
      .pipe(gulp.dest(jsDestination))
  })

  gulp.task('lib-diff', function () {
    return gulp.src('node_modules/diff/dist/diff.js')
      .pipe(filecount())
      .pipe(gulp.dest(jsDestination))
  })

  gulp.task('lib-jquery', function () {
    return gulp.src('node_modules/jquery/dist/jquery.js')
      .pipe(filecount())
      .pipe(gulp.dest(jsDestination))
  })

  gulp.task('lib-styles', function () {
    return gulp.src('node_modules/normalize.css/normalize.css')
      .pipe(filecount())
      .pipe(gulp.dest(cssDestination))
  })

  gulp.task('lib-modernizr', function () {
    return gulp.src(['scripts/background/featuredetect.js'])
      .pipe(filecount())
      .pipe(modernizr())
      .pipe(gulp.dest(jsDestination))
  })

  gulp.task('lib-requirejs', function () {
    return gulp.src('node_modules/requirejs/require.js')
      .pipe(filecount())
      .pipe(gulp.dest('basic/scripts/'))
      .pipe(gulp.dest('boule/scripts/'))
      .pipe(gulp.dest('tac/scripts/'))
      .pipe(gulp.dest('test/scripts/'))
  })

  gulp.task('lib-semver', function () {
    return gulp.src(['node_modules/semver/semver.browser.js'])
      .pipe(filecount())
      .pipe(gulp.dest(jsDestination))
  })

  gulp.task('lib-tuvero', function () {
    return gulp.src('node_modules/tuvero/dist/tuvero.bundle-amd.js')
      .pipe(filecount())
      .pipe(gulp.dest(jsDestination))
  })

  gulp.task('lib-test-scripts', function () {
    return gulp.src('node_modules/qunit/qunit/qunit.js')
      .pipe(filecount())
      .pipe(gulp.dest('test/scripts/'))
  })

  gulp.task('lib-test-styles', function () {
    return gulp.src('node_modules/qunit/qunit/qunit.css')
      .pipe(filecount())
      .pipe(gulp.dest('test/style/'))
  })

  return Object.keys(gulp.tasks).filter(task => /^lib-.*$/.test(task))
}
