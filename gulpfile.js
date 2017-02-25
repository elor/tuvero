/// <binding />
var bower = require('gulp-bower');
var del = require('del');
var gulp = require('gulp');
var manifest = require('gulp-manifest');
var modernizr = require('gulp-modernizr');
var rename = require('gulp-rename');

var mainstyle = require('./gulp-tools/mainstyle');

gulp.task('all', ['lib']);
gulp.task('build', ['build-static']);
gulp.task('clean', ['clean-lib', 'clean-build']);
gulp.task('update', ['update-mainstyle']);

gulp.task('lib', ['lib-blob', 'lib-extend', 'lib-filesaver', 'lib-jquery', 'lib-jsdiff', 'lib-modernizr', 'lib-normalize', 'lib-typeahead']);

gulp.task('bower', function () {
    return bower();
});

/**
 * lib/
 **/
gulp.task('lib-blob', ['bower'], function () {
    return gulp.src('bower_components/Blob/Blob.js')
        .pipe(gulp.dest('lib/'));
});

gulp.task('lib-extend', ['bower'], function () {
    return gulp.src('bower_components/extend/index.js')
        .pipe(rename('extend.js'))
        .pipe(gulp.dest('lib/'));
});

gulp.task('lib-filesaver', ['bower'], function () {
    return gulp.src('bower_components/FileSaver/FileSaver.min.js')
        .pipe(rename('FileSaver.js'))
        .pipe(gulp.dest('lib/'));
});

gulp.task('lib-jsdiff', ['bower'], function () {
    return gulp.src('bower_components/jsdiff/diff.min.js')
        .pipe(rename('diff.js'))
        .pipe(gulp.dest('lib/'));
});

gulp.task('lib-normalize', ['bower'], function () {
    return gulp.src('bower_components/normalize.css/normalize.css')
        .pipe(gulp.dest('lib/'));
});

gulp.task('lib-jquery', ['bower'], function () {
    return gulp.src('bower_components/jquery/dist/jquery.min.js')
        .pipe(rename('jquery.js'))
        .pipe(gulp.dest('lib/'));
});

gulp.task('lib-typeahead', ['bower'], function () {
    return gulp.src('bower_components/typeahead.js/dist/typeahead.bundle.min.js')
        .pipe(rename('typeahead.js'))
        .pipe(gulp.dest('lib/'));
});

gulp.task('lib-modernizr', function () {
    gulp.src(['*/scripts/*.js', '*/scripts/*/*.js', '*/scripts/*/*/*.js'])
        .pipe(modernizr())
        .pipe(gulp.dest("lib/"));
});

/**
 * clean
 **/
gulp.task('clean-lib', function () {
    return del('lib');
});

gulp.task('clean-build', function () {
    return del('build');
});

gulp.task('clean-dev', function () {
    return del('dev');
});

/**
 * build
 **/
gulp.task('build-static', ['build-static-images', 'build-static-html', 'build-static-manifest']);

gulp.task('build-static-html', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest('build/'));
});

gulp.task('build-static-images', function () {
    return gulp.src('images/*.png')
        .pipe(gulp.dest('build/images/'));
});

gulp.task('build-static-manifest', function () {
    return gulp.src(['index.html', 'images/*.png'], { base: './' })
        .pipe(manifest({ filename: 'manifest.appcache', timestamp: false, hash: true }))
        .pipe(gulp.dest('build/'));
});

/**
 * update
 **/
gulp.task('update-mainstyle', function () {
    return gulp.src(['lib/*.css', 'core/style/*.css', 'legacy/style/*.css', '!core/style/mainstyle.css'], { base: './' })
        .pipe(mainstyle())
        .pipe(gulp.dest('core/style'));
});
