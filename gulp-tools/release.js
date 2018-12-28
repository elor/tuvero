'use strict'

var del = require('del')
var gulp = require('gulp')
var sources = require('./sources')
var replace = require('gulp-replace')

module.exports = function () {
  gulp.task('release-date', ['build'], function () {
    var date = (new Date()).toISOString().slice(0, 10)

    gulp.src('NEWS')
      .pipe(replace('yyyy-mm-dd', date))
      .pipe(gulp.dest('.'))
  })

  gulp.task('release-source-cleanup', ['release-date'], function () {
    return del(sources.release_source_cleanup)
  })

  gulp.task('release-copy-build', ['build', 'release-source-cleanup'], function () {
    return gulp.src('build/**/*', { baseDir: 'build' })
      .pipe(gulp.dest('.'))
  })

  gulp.task('release-final-cleanup', ['release-copy-build'], function () {
    return del(sources.release_final_cleanup)
  })

  return ['release-date', 'release-source-cleanup', 'release-copy-build', 'release-final-cleanup']
}
