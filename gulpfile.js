/// <binding BeforeBuild='all' />
var gulp = require('gulp');
var rename = require('gulp-rename');
var bower = require('gulp-bower');

gulp.task('all', ['lib']);

gulp.task('lib', ['lib-requirejs', 'lib-extend', 'lib-blob', 'lib-filesaver', 'lib-jsdiff', 'lib-normalize.css', 'lib-jquery']);

gulp.task('bower', function () {
    return bower();
});

/**
 * lib/
 **/
gulp.task('lib-requirejs', ['bower'], function () {
    return gulp.src('bower_components/requirejs/require.js')
        .pipe(gulp.dest('lib/'));
});

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

gulp.task('lib-normalize.css', ['bower'], function () {
    return gulp.src('bower_components/normalize.css/normalize.css')
        .pipe(gulp.dest('lib/'))
});

gulp.task('lib-jquery', ['bower'], function () {
    return gulp.src('bower_components/jquery/dist/jquery.min.js')
        .pipe(rename('jquery.js'))
        .pipe(gulp.dest('lib/'));
});
