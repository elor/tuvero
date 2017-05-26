var createcommonjs = require('./gulp-tools/create-common');
var createtestjs = require('./gulp-tools/create-test');
var del = require('del');
var filecount = require('./gulp-tools/filecount');
var gulp = require('gulp-npm-run')(require('gulp'));
var mainstyle = require('./gulp-tools/mainstyle');
var checkdependencies = require('./gulp-tools/check-dependencies');
var manifest = require('gulp-manifest');
var rename = require('gulp-rename');
var template = require('./gulp-tools/template');
var libs = require('./gulp-tools/libs');
var buildstyle = require('./gulp-tools/buildstyle');
var multiprocess = require('gulp-multi-process');

var sources = {
    styles: ['lib/*.css', 'style/**/*.css', '!style/mainstyle.css'],
    scripts_and_tests: ['scripts/*/*.js', '!scripts/core/{common,config,main}.js'],
    scripts: ['scripts/*/*.js', '!scripts/core/{common,config,main}.js', '!**/test/*.js'],
    dependant_scripts: [
        'scripts/*/*.js',
        '{basic,boule,tac,test}/scripts/{presets,options,strings}.js',
        'scripts/**/test/*.js',
        '!scripts/core/{common,config,main}.js',
        '!**/lib/*.js'
    ],
    tests: ['scripts/**/test/*.js'],
    templates: 'templates/**/*.html',
    template_path: 'templates'
};

gulp.task('all', ['lib', 'update', 'build']);
gulp.task('default', ['all']);
gulp.task('update', ['update-mainstyle', 'update-common-js', 'update-test-js', 'template']);
gulp.task('template', ['template-basic', 'template-boule', 'template-tac']);
gulp.task('build', ['build-static', 'build-boule', 'build-basic', 'build-tac']);

gulp.task('lib', libs());

gulp.task('clean', function () {
    return del('lib|build|dev|{basic,boule,tac}/index.html|style/mainstyle.css|scripts/common.css');
});

gulp.task('build-static', ['build-static-images', 'build-static-html', 'build-static-manifest']);

gulp.task('build-static-html', function () {
    return gulp.src('index.html')
        .pipe(filecount())
        .pipe(gulp.dest('build/'));
});

gulp.task('build-static-images', function () {
    return gulp.src('images/*.png')
        .pipe(filecount())
        .pipe(gulp.dest('build/images/'));
});

gulp.task('build-static-manifest', function () {
    return gulp.src(['index.html', 'images/*.png'], { base: './' })
        .pipe(filecount())
        .pipe(manifest({ filename: 'manifest.appcache', timestamp: false, hash: true }))
        .pipe(filecount())
        .pipe(gulp.dest('build/'));
});

gulp.task('build-basic', ['template', 'build-basic-style']);
gulp.task('build-boule', ['template', 'build-boule-style']);
gulp.task('build-tac', ['template', 'build-tac-style']);

gulp.task('build-basic-style-internal', buildstyle('basic'));
gulp.task('build-boule-style-internal', buildstyle('boule'));
gulp.task('build-tac-style-internal', buildstyle('tac'));

gulp.task('build-basic-style', function (cb) {
    return multiprocess(['build-basic-style-internal'], cb);
});
gulp.task('build-boule-style', function (cb) {
    return multiprocess(['build-boule-style-internal'], cb);
});
gulp.task('build-tac-style', function (cb) {
    return multiprocess(['build-tac-style-internal'], cb);
});

gulp.task('check-dependencies', function () {
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

gulp.task('template-basic', template('basic', sources.template_path));
gulp.task('template-boule', template('boule', sources.template_path));
gulp.task('template-tac', template('tac', sources.template_path));

gulp.task('watch', function () {
    gulp.watch(sources.scripts, ['update-common-js']);
    gulp.watch(sources.scripts_and_tests, ['test']);
    gulp.watch(sources.dependant_scripts, ['check-dependencies']);
    gulp.watch(sources.styles, ['update-mainstyle']);
    gulp.watch(sources.templates, ['template']);
    gulp.watch(sources.tests, ['update-test-js']);
});
