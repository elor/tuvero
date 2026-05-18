'use strict'

const gulp = require('gulp')

const cssDestination = 'lib/'

function libStyles () {
  return gulp.src('node_modules/normalize.css/normalize.css')
    .pipe(gulp.dest(cssDestination))
}

module.exports = {
  libStyles
}
