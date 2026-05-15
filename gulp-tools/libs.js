'use strict'

const { spawn } = require('child_process')
const filecount = require('./filecount')
const gulp = require('gulp')

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

async function libTuvero () {
  await new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', 'dist', '--workspace=libtuvero'], { stdio: 'inherit' })
    proc.on('error', reject)
    proc.on('exit', code => code === 0 ? resolve() : reject(new Error(`libtuvero dist failed (exit ${code})`)))
  })
  return new Promise((resolve, reject) => {
    gulp.src('libtuvero/dist/tuvero.bundle-amd.js')
      .pipe(filecount())
      .pipe(gulp.dest(jsDestination))
      .on('error', reject)
      .on('end', resolve)
  })
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
  libRequirejs,
  libSemver,
  libTuvero,
  libTestScripts,
  libTestStyles
}
