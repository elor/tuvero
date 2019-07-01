'use strict'

const path = require('path')
const gulp = require('gulp')
const replace = require('gulp-replace')
const cleancss = require('gulp-clean-css')
const fs = require('fs')

const urlregex = /url\(['"]?([^"']+\.png)['"]?\)/

function pngToBase64 (filename) {
  let encoded = fs.readFileSync(filename, { encoding: 'base64' })

  return `data:image/png;base64,${encoded}`
}

module.exports = function (srcpath, dstpath) {
  return function () {
    process.chdir(srcpath)
    dstpath = path.relative(srcpath, dstpath)

    return gulp.src(['main.css'])
      .pipe(cleancss({ compatibility: 'ie9', inline: ['all'] }))
      .pipe(replace(urlregex, (match) => `url("${pngToBase64(match.match(urlregex)[1])}")`))
      .pipe(gulp.dest(dstpath))
  }
}
