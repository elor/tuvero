var createcommonjs = require('./gulp-tools/create-common');
var createtestjs = require('./gulp-tools/create-test');
var filecount = require('./gulp-tools/filecount');
var run = require('gulp-run');
var gulp = require('gulp');
var mainstyle = require('./gulp-tools/mainstyle');
var checkdependencies = require('./gulp-tools/check-dependencies');
var template = require('./gulp-tools/template');
var libs = require('./gulp-tools/libs');
var build = require('./gulp-tools/build');

var sources = {
  styles: ['lib/*.css', 'style/**/*.css', '!style/mainstyle.css'],
  scripts_and_tests: ['scripts/**/*.js', '!scripts/core/{common,config,main}.js', '!**/lib/*.js'],
  scripts: ['scripts/*/*.js', '!scripts/core/{common,config,main}.js', '!**/{lib,test}/*.js'],
  dependant_scripts: [
    'scripts/*/*.js',
    '{basic,boule,tac,test}/scripts/{presets,options,strings}.js',
    'scripts/**/test/*.js',
    '!scripts/core/{common,config,main}.js',
    '!**/lib/*.js'
  ],
  tests: ['scripts/**/test/*.js'],
  templates: 'templates/*.html',
  template_index: 'templates/index.html'
};

gulp.task('default', ['lib', 'update', 'build', 'test']);
gulp.task('update', ['update-mainstyle', 'update-common-js', 'update-test-js', 'template']);
gulp.task('template', build.targets.map(target => template(target, sources)));
gulp.task('test', ['lib', 'test-dependencies'], function () {
  return run('node cli/test.js').exec();
});

gulp.task('lib', libs());
gulp.task('build', build());

gulp.task('test-dependencies', ['lib'], function () {
  return gulp.src(sources.dependant_scripts, { base: 'scripts' })
    .pipe(filecount())
    .pipe(checkdependencies());
});

/**
 * update
 **/
gulp.task('update-mainstyle', ['lib-normalize'], function () {
  return gulp.src(sources.styles, { base: 'style/' })
    .pipe(filecount())
    .pipe(mainstyle())
    .pipe(filecount())
    .pipe(gulp.dest('style'));
});

gulp.task('update-common-js', [], function () {
  return gulp.src(sources.scripts, { base: 'scripts/' })
    .pipe(filecount())
    .pipe(createcommonjs())
    .pipe(gulp.dest('scripts/core'));
});

gulp.task('update-test-js', [], function () {
  return gulp.src(sources.tests, { base: 'scripts/' })
    .pipe(filecount())
    .pipe(createtestjs())
    .pipe(gulp.dest('test/scripts'));
});

gulp.task('watch', function () {
  gulp.watch(sources.scripts, ['update-common-js']);
  gulp.watch(sources.scripts_and_tests, ['test']);
  gulp.watch(sources.dependant_scripts, ['test-dependencies']);
  gulp.watch(sources.styles, ['update-mainstyle']);
  gulp.watch(sources.templates, ['template']);
  gulp.watch(sources.tests, ['update-test-js']);
});
