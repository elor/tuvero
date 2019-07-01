'use strict'

var filecount = require('./filecount')
var run = require('gulp-run')
var gulp = require('gulp')
var manifest = require('gulp-manifest')
var buildstyle = require('./buildstyle')
var replace = require('gulp-replace')
var rjs = require('./rjs-optimize')
var inlinesource = require('gulp-inline-source')
const uglify = require('gulp-uglify')

var targets = ['basic', 'boule', 'tac', 'test']

module.exports = function () {
  targets.forEach(function (target) {
    gulp.task(`build-${target}`, [`build-${target}-inline`], function () {
      return gulp.src(`build/${target}/{*.html,scripts/*.js,style/*.css,images/*.png}`)
        .pipe(filecount())
        .pipe(manifest({ filename: 'manifest.appcache', timestamp: false, hash: true }))
        .pipe(filecount())
        .pipe(gulp.dest(`build/${target}/`))
    })

    gulp.task(`build-${target}-style-internal`,
      buildstyle(`${target}/style`, `tmp/${target}/style`))

    gulp.task(`build-${target}-style`, ['update-mainstyle'], function () {
      return run(`gulp build-${target}-style-internal`).exec()
    })

    gulp.task(`build-${target}-scripts`, ['lib', 'update-common-js'], function () {
      return gulp.src([`${target}/scripts/{test,main}.js`], { base: './' })
        .pipe(rjs({ outDir: 'tmp' }))
    })

    if (target === 'test') {
      gulp.task('build-test-html')
    } else {
      gulp.task(`build-${target}-html`, ['template'], function () {
        return gulp.src([`${target}/*.html`])
          .pipe(replace(/\s*<script>[^<]*<\/script>/g, ''))
          .pipe(replace(/<html/, '<html manifest="manifest.appcache"'))
          .pipe(gulp.dest(`tmp/${target}/`))
      })
    }

    gulp.task(`build-${target}-requirejs`, ['lib-requirejs'], function () {
      return gulp.src([`${target}/scripts/require.js`])
        .pipe(filecount())
        .pipe(uglify())
        .pipe(gulp.dest(`tmp/${target}/scripts/`))
    })

    gulp.task(`build-${target}-images`, function () {
      return gulp.src([`${target}/images/{sprite,favicon}.png`])
        .pipe(gulp.dest(`tmp/${target}/images/`))
    })

    gulp.task(`build-${target}-inline`, [
      `build-${target}-images`,
      `build-${target}-html`,
      `build-${target}-requirejs`,
      `build-${target}-scripts`,
      `build-${target}-style`
    ], function () {
      if (target === 'test') {
        return gulp.src([`tmp/${target}/{*.html,/scripts/*.js,/style/*.css,/images/*.png}`])
          .pipe(gulp.dest(`build/${target}/`))
      } else {
        return gulp.src(`tmp/${target}/*.html`)
          .pipe(inlinesource({ compress: false }))
          .pipe(gulp.dest(`build/${target}/`))
      }
    })
  })

  return ['build-boule', 'build-basic', 'build-tac', 'build-test']
}
module.exports.targets = targets
