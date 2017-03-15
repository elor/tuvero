var bower = require('gulp-bower');
var del = require('del');
var gulp = require('gulp');
var manifest = require('gulp-manifest');
var modernizr = require('gulp-modernizr');
var nunjucks = require('gulp-nunjucks');
var rename = require('gulp-rename');

var mainstyle = require('./gulp-tools/mainstyle');
var filecount = require('./gulp-tools/filecount');
var createcommonjs = require('./gulp-tools/create-common');

gulp.task('all', ['lib', 'update', 'build']);
gulp.task('build', ['build-static', 'build-boule']);
gulp.task('clean', ['clean-lib', 'clean-build']);
gulp.task('update', ['update-mainstyle', 'update-common-js']);

gulp.task('lib', ['lib-blob', 'lib-extend', 'lib-filesaver', 'lib-jquery', 'lib-jsdiff', 'lib-modernizr', 'lib-normalize', 'lib-typeahead']);

gulp.task('bower', function () {
    return bower();
});

/**
 * lib/
 **/
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

/**
 * update
 **/
gulp.task('update-mainstyle', ['lib-normalize'], function () {
    return gulp.src(['lib/*.css', '{core,legacy}/style/*.css', '!core/style/mainstyle.css'], { base: './' })
        .pipe(filecount())
        .pipe(mainstyle())
        .pipe(filecount())
        .pipe(gulp.dest('core/style'));
});

gulp.task('update-common-js', [], function () {
    return gulp.src(['lib/*.js', 'core/scripts/*.js', 'legacy/scripts/**/*.js', '!core/scripts/{common,config,main}.js', '!**/test/*.js'], { base: './' })
        .pipe(createcommonjs())
        .pipe(gulp.dest('core/scripts'));
});


/**
 * templates
 **/
function templateStrings(variant) {
    var requirejs = require('requirejs').config({
        baseUrl: variant + '/scripts',
        paths: {
            'ui': '../../legacy/scripts/ui/'
        },
        nodeRequire: require
    });

    var strings = requirejs('ui/strings');
    strings.version = '1.5.6';

    return strings;
}

gulp.task('template', ['template-basic', 'template-boule', 'template-tac']);
gulp.task('template-basic', function () {
    return gulp.src('core/templates/index.html')
        .pipe(filecount())
        .pipe(nunjucks.compile(templateStrings('basic')))
        .pipe(filecount())
        .pipe(gulp.dest('basic/'));
});

gulp.task('template-boule', function () {
    return gulp.src('core/templates/index.html')
        .pipe(filecount())
        .pipe(nunjucks.compile(templateStrings('boule')))
        .pipe(filecount())
        .pipe(gulp.dest('boule/'));
});

gulp.task('template-tac', function () {
    return gulp.src('core/templates/index.html')
        .pipe(filecount())
        .pipe(nunjucks.compile(templateStrings('tac')))
        .pipe(filecount())
        .pipe(gulp.dest('tac/'));
});

gulp.task('build-basic', ['template-basic']);
gulp.task('build-boule', ['template-boule']);
gulp.task('build-tac', ['template-tac']);

gulp.task('watch', function () {
    gulp.watch('core/templates/**/*.html', ['template']);
});
