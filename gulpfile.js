var createcommonjs = require('./gulp-tools/create-common');
var createtestjs = require('./gulp-tools/create-test');
var filecount = require('./gulp-tools/filecount');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var run = require('gulp-run');
var build = require('./gulp-tools/build');
var release = require('./gulp-tools/release');
var checkdependencies = require('./gulp-tools/check-dependencies');
var libs = require('./gulp-tools/libs');
var mainstyle = require('./gulp-tools/mainstyle');
var sources = require('./gulp-tools/sources');
var template = require('./gulp-tools/template');

gulp.task('default', ['lib', 'update', 'lint', 'build', 'test']);
gulp.task('update', ['update-mainstyle', 'update-common-js', 'update-test-js', 'template']);
gulp.task('template', build.targets.map(target => template(target, sources)));
gulp.task('test', ['lib', 'lint', 'test-dependencies'], function () {
  return run('node cli/test.js').exec();
});

gulp.task('lib', libs());
gulp.task('build', build());
gulp.task('release', release());

gulp.task('test-dependencies', ['lib'], function () {
  return gulp.src(sources.dependent_scripts, { base: 'scripts' })
    .pipe(filecount())
    .pipe(checkdependencies());
});

/**
 * update
 **/
gulp.task('update-mainstyle', ['lib-styles'], function () {
  return gulp.src(sources.styles, { base: 'style/' })
    .pipe(filecount())
    .pipe(mainstyle())
    .pipe(filecount())
    .pipe(gulp.dest('style'));
});

gulp.task('update-common-js', function () {
  return gulp.src(sources.scripts, { base: 'scripts/' })
    .pipe(filecount())
    .pipe(createcommonjs())
    .pipe(gulp.dest('scripts/core'));
});

gulp.task('update-test-js', function () {
  return gulp.src(sources.tests, { base: 'scripts/' })
    .pipe(filecount())
    .pipe(createtestjs())
    .pipe(gulp.dest('test/scripts'));
});

gulp.task('lint', function () {
  return gulp.src(sources.scripts_for_linting)
    .pipe(filecount())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function () {
  gulp.watch(sources.scripts, ['update-common-js']);
  gulp.watch(sources.scripts_for_linting, ['lint']);
  gulp.watch(sources.scripts_and_tests, ['test']);
  gulp.watch(sources.dependent_scripts, ['test-dependencies']);
  gulp.watch(sources.styles, ['update-mainstyle']);
  gulp.watch(sources.templates, ['template']);
  gulp.watch(sources.tests, ['update-test-js']);
});
