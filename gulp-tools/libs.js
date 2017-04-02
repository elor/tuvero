'use strict';

var bower = require('gulp-bower');
var filecount = require('./filecount');
var gulp = require('gulp');
var modernizr = require('gulp-modernizr');
var rename = require('gulp-rename');

module.exports = function () {
    gulp.task('bower', function () {
        return bower();
    });

    gulp.task('lib-blob', ['bower'], function () {
        return gulp.src('bower_components/Blob/Blob.js')
            .pipe(filecount())
            .pipe(gulp.dest('lib/'));
    });

    gulp.task('lib-extend', ['bower'], function () {
        return gulp.src('bower_components/extend/dist/extend.min.js')
            .pipe(filecount())
            .pipe(rename('extend.js'))
            .pipe(gulp.dest('lib/'));
    });

    gulp.task('lib-filesaver', ['bower'], function () {
        return gulp.src('bower_components/FileSaver/FileSaver.min.js')
            .pipe(filecount())
            .pipe(rename('FileSaver.js'))
            .pipe(gulp.dest('lib/'));
    });

    gulp.task('lib-jsdiff', ['bower'], function () {
        return gulp.src('bower_components/jsdiff/diff.min.js')
            .pipe(filecount())
            .pipe(rename('diff.js'))
            .pipe(gulp.dest('lib/'));
    });

    gulp.task('lib-normalize', ['bower'], function () {
        return gulp.src('bower_components/normalize.css/normalize.css')
            .pipe(filecount())
            .pipe(gulp.dest('lib/'));
    });

    gulp.task('lib-jquery', ['bower'], function () {
        return gulp.src('bower_components/jquery/dist/jquery.min.js')
            .pipe(filecount())
            .pipe(rename('jquery.js'))
            .pipe(gulp.dest('lib/'));
    });

    gulp.task('lib-typeahead', ['bower'], function () {
        return gulp.src('bower_components/typeahead.js/dist/typeahead.bundle.min.js')
            .pipe(filecount())
            .pipe(rename('typeahead.js'))
            .pipe(gulp.dest('lib/'));
    });

    gulp.task('lib-modernizr', function () {
        gulp.src('{core,legacy}/scripts/**/*.js')
            .pipe(filecount())
            .pipe(modernizr())
            .pipe(gulp.dest("lib/"));
    });

    return ['lib-blob', 'lib-extend', 'lib-filesaver', 'lib-jquery', 'lib-jsdiff', 'lib-modernizr', 'lib-normalize', 'lib-typeahead'];
};
