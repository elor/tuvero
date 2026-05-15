'use strict'

const filecount = require('./filecount')
const gulp = require('gulp')
const modernizr = require('gulp-modernizr')
const through = require('through2')
const Vinyl = require('vinyl')

function rewrapVinyl () {
  return through.obj(function (file, enc, cb) {
    this.push(new Vinyl({
      cwd: file.cwd,
      base: file.base,
      path: file.path,
      contents: Buffer.isBuffer(file.contents) ? file.contents : Buffer.from(file.contents)
    }))
    cb()
  })
}

const jsDestination = 'scripts/lib/'
const cssDestination = 'lib/'

function libScripts () {
  return gulp.src([
    'node_modules/file-saver/dist/FileSaver.js',
    'node_modules/diff/dist/diff.js',
    'node_modules/jquery/dist/jquery.js'
  ])
    .pipe(filecount())
    .pipe(gulp.dest(jsDestination))
}

function libStyles () {
  return gulp.src('node_modules/normalize.css/normalize.css')
    .pipe(filecount())
    .pipe(gulp.dest(cssDestination))
}

function libModernizr () {
  return gulp.src(['scripts/background/featuredetect.js'])
    .pipe(filecount())
    .pipe(modernizr())
    .pipe(rewrapVinyl())
    .pipe(gulp.dest(jsDestination))
}

function libRequirejs () {
  return gulp.src('node_modules/requirejs/require.js')
    .pipe(filecount())
    .pipe(gulp.dest('basic/scripts/'))
    .pipe(gulp.dest('boule/scripts/'))
    .pipe(gulp.dest('tac/scripts/'))
    .pipe(gulp.dest('test/scripts/'))
}

function libSemver () {
  return gulp.src(['node_modules/semver/semver.browser.js'])
    .pipe(filecount())
    .pipe(gulp.dest(jsDestination))
}

function libTuvero () {
  return gulp.src('vendor/tuvero.bundle-amd.js')
    .pipe(filecount())
    .pipe(gulp.dest(jsDestination))
}

function libTestScripts () {
  return gulp.src('node_modules/qunit/qunit/qunit.js')
    .pipe(filecount())
    .pipe(gulp.dest('test/scripts/'))
}

function libTestStyles () {
  return gulp.src('node_modules/qunit/qunit/qunit.css')
    .pipe(filecount())
    .pipe(gulp.dest('test/style/'))
}

module.exports = {
  libScripts,
  libStyles,
  libModernizr,
  libRequirejs,
  libSemver,
  libTuvero,
  libTestScripts,
  libTestStyles
}
