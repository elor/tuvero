var createcommonjs = require('./gulp-tools/create-common');
var createtestjs = require('./gulp-tools/create-test');
var del = require('del');
var filecount = require('./gulp-tools/filecount');
var gulp = require('gulp');
var mainstyle = require('./gulp-tools/mainstyle');
var manifest = require('gulp-manifest');
var rename = require('gulp-rename');
var template = require('./gulp-tools/template');
var libs = require('./gulp-tools/libs');
var buildstyle = require('./gulp-tools/buildstyle');

var sources = {
    styles: ['lib/*.css', 'style/**/*.css', '!style/mainstyle.css'],
    scripts: ['scripts/*/*.js', '!scripts/core/{common,config,main}.js', '!**/test/*.js'],
    tests: ['scripts/**/test/*.js'],
    templates: 'core/templates/**/*.html'
};

gulp.task('all', ['lib', 'update', 'build']);
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

gulp.task('build-basic-style', buildstyle('basic'));
gulp.task('build-boule-style', buildstyle('boule'));
gulp.task('build-tac-style', buildstyle('tac'));

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
    return gulp.src(sources.tests, { base: './' })
        .pipe(filecount())
        .pipe(createtestjs())
        .pipe(gulp.dest('test/scripts'));
});

gulp.task('template-basic', template('basic'));
gulp.task('template-boule', template('boule'));
gulp.task('template-tac', template('tac'));

gulp.task('watch', function () {
    gulp.watch(sources.scripts, ['update-common-js']);
    gulp.watch(sources.styles, ['update-mainstyle']);
    gulp.watch(sources.templates, ['template']);
    gulp.watch(sources.tests, ['update-test-js']);
});
