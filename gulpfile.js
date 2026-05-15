'use strict'

const { spawn } = require('child_process')
const gulp = require('gulp')

const createcommonjs = require('./gulp-tools/create-common')
const createtestjs = require('./gulp-tools/create-test')
const filecount = require('./gulp-tools/filecount')
const build = require('./gulp-tools/build')
const release = require('./gulp-tools/release')
const checkdependencies = require('./gulp-tools/check-dependencies')
const libs = require('./gulp-tools/libs')
const mainstyle = require('./gulp-tools/mainstyle')
const sources = require('./gulp-tools/sources')
const template = require('./gulp-tools/template')

gulp.task('lib-scripts', libs.libScripts)
gulp.task('lib-styles', libs.libStyles)
gulp.task('lib-modernizr', libs.libModernizr)
gulp.task('lib-requirejs', libs.libRequirejs)
gulp.task('lib-semver', libs.libSemver)
gulp.task('lib-tuvero', libs.libTuvero)
gulp.task('lib-test-scripts', libs.libTestScripts)
gulp.task('lib-test-styles', libs.libTestStyles)

gulp.task('lib', gulp.parallel(
  'lib-scripts',
  'lib-styles',
  'lib-modernizr',
  'lib-requirejs',
  'lib-semver',
  'lib-tuvero',
  'lib-test-scripts',
  'lib-test-styles'
))

gulp.task('update-mainstyle', gulp.series('lib-styles', function updateMainstyle () {
  return gulp.src(sources.styles, { base: 'style/' })
    .pipe(filecount())
    .pipe(mainstyle())
    .pipe(filecount())
    .pipe(gulp.dest('style'))
}))

gulp.task('update-common-js', function updateCommonJs () {
  return gulp.src(sources.scripts, { base: 'scripts/' })
    .pipe(filecount())
    .pipe(createcommonjs())
    .pipe(gulp.dest('scripts/core'))
})

gulp.task('update-test-js', function updateTestJs () {
  return gulp.src(sources.tests, { base: 'scripts/' })
    .pipe(filecount())
    .pipe(createtestjs())
    .pipe(gulp.dest('test/scripts'))
})

template.register(gulp, sources)
gulp.task('template', gulp.parallel(template.targets.map(t => `template-${t}`)))

gulp.task('update', gulp.parallel(
  'update-mainstyle',
  'update-common-js',
  'update-test-js',
  'template'
))

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

build.register(gulp, sources)
gulp.task('build', gulp.parallel(build.targets.map(t => `build-${t}`)))

release.register(gulp, sources)
gulp.task('release', gulp.series('release-final-cleanup'))

gulp.task('test-dependencies', gulp.series('lib', function testDependencies () {
  return gulp.src(sources.dependent_scripts, { base: 'scripts' })
    .pipe(filecount())
    .pipe(checkdependencies())
}))

gulp.task('test', gulp.series('lib', 'lint', function runTests () {
  return spawn(process.execPath, ['cli/test.js'], { stdio: 'inherit' })
}))

gulp.task('default', gulp.series('lib', 'update', 'lint', 'build', 'test'))

gulp.task('watch', function watch () {
  gulp.watch(sources.scripts, gulp.series('update-common-js'))
  gulp.watch(sources.scripts_for_standardjs, gulp.series('lint-standard'))
  gulp.watch(sources.scripts_and_tests, gulp.series('test'))
  gulp.watch(sources.dependent_scripts, gulp.series('test-dependencies'))
  gulp.watch(sources.styles, gulp.series('update-mainstyle'))
  gulp.watch(sources.templates, gulp.series('template'))
  gulp.watch(sources.tests, gulp.series('update-test-js'))
})
