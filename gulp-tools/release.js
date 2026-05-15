'use strict'

const del = require('del')
const gulp = require('gulp')
const replace = require('gulp-replace')

function register (gulp, sources) {
  gulp.task(
    'release-date',
    gulp.series('build', function releaseDate () {
      const date = (new Date()).toISOString().slice(0, 10)
      return gulp.src('NEWS', { allowEmpty: true })
        .pipe(replace('yyyy-mm-dd', date))
        .pipe(gulp.dest('.'))
    })
  )

  gulp.task(
    'release-source-cleanup',
    gulp.series('release-date', function releaseSourceCleanup () {
      return del(sources.release_source_cleanup)
    })
  )

  gulp.task(
    'release-copy-build',
    gulp.series('release-source-cleanup', function releaseCopyBuild () {
      return gulp.src('build/**/*', { base: 'build', encoding: false })
        .pipe(gulp.dest('.'))
    })
  )

  gulp.task(
    'release-final-cleanup',
    gulp.series('release-copy-build', function releaseFinalCleanup () {
      return del(sources.release_final_cleanup)
    })
  )
}

module.exports = { register }
