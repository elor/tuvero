'use strict'

const { spawn } = require('child_process')
const gulp = require('gulp')

const filecount = require('./gulp-tools/filecount')
const libs = require('./gulp-tools/libs')
const mainstyle = require('./gulp-tools/mainstyle')
const sources = require('./gulp-tools/sources')

gulp.task('lib-styles', libs.libStyles)

gulp.task('lib', gulp.parallel('lib-styles'))

gulp.task('update-mainstyle', gulp.series('lib-styles', function updateMainstyle () {
  return gulp.src(sources.styles, { base: 'style/' })
    .pipe(filecount())
    .pipe(mainstyle())
    .pipe(filecount())
    .pipe(gulp.dest('style'))
}))

gulp.task('update', gulp.parallel('update-mainstyle'))

gulp.task('lint-standard', async function lintStandard () {
  const { default: standard } = await import('standard')
  const positives = sources.scripts_for_standardjs.filter(p => !p.startsWith('!'))
  const ignores = sources.scripts_for_standardjs
    .filter(p => p.startsWith('!'))
    .map(p => p.slice(1))
  const result = await standard.lintFiles(positives, { ignore: ignores })
  if (result.errorCount > 0 || result.warningCount > 0) {
    for (const fileResult of result.results) {
      for (const msg of fileResult.messages) {
        const sev = msg.severity === 2 ? 'error' : 'warning'
        console.error(
          `${fileResult.filePath}:${msg.line}:${msg.column}: ${sev} ${msg.message} (${msg.ruleId || ''})`
        )
      }
    }
  }
  if (result.errorCount > 0) {
    throw new Error(`standard: ${result.errorCount} lint error(s)`)
  }
})

gulp.task('lint', gulp.series('lint-standard'))

gulp.task('test', gulp.series(function runTests () {
  return spawn(process.execPath, ['cli/test.js'], { stdio: 'inherit' })
}))

gulp.task('default', gulp.series('update', 'lint', 'test'))

gulp.task('watch', function watch () {
  gulp.watch(sources.scripts_for_standardjs, gulp.series('lint-standard'))
  gulp.watch(sources.styles, gulp.series('update-mainstyle'))
})
