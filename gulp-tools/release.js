'use strict'

const del = require('del')

function register (gulp, sources) {
  gulp.task(
    'release-source-cleanup',
    gulp.series('build', function releaseSourceCleanup () {
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
