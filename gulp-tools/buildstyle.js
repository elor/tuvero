'use strict'

const path = require('path')
const gulp = require('gulp')
const replace = require('gulp-replace')
const cleancss = require('gulp-clean-css')
const fs = require('fs')

const urlregex = /url\(['"]?([^"')]+\.png)['"]?\)/

function pngToBase64 (filename) {
  const encoded = fs.readFileSync(filename, { encoding: 'base64' })
  return `data:image/png;base64,${encoded}`
}

module.exports = function (srcpath, dstpath) {
  return function buildstyleTask () {
    return gulp.src(path.join(srcpath, 'main.css'), { base: srcpath })
      .pipe(cleancss({ compatibility: 'ie9', inline: ['all'] }))
      .pipe(replace(urlregex, (match, relPath) => {
        return `url("${pngToBase64(path.join(srcpath, relPath))}")`
      }))
      .pipe(gulp.dest(dstpath))
  }
}
