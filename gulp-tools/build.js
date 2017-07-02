'use strict';

var filecount = require('./filecount');
var run = require('gulp-run');
var gulp = require('gulp');
var manifest = require('gulp-manifest');
var buildstyle = require('./buildstyle');
var replace = require("gulp-replace");
var rjs = require('./rjs-optimize');
var inlinesource = require('gulp-inline-source');

var targets = ['basic', 'boule', 'tac'];

module.exports = function () {
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

  targets.forEach(function (target) {
    gulp.task(`build-${target}`, [
      `build-${target}-inline`
    ]);

    gulp.task(`build-${target}-style-internal`,
      buildstyle(`${target}/style`, `tmp/${target}/style`));

    gulp.task(`build-${target}-style`, ['update-mainstyle'], function () {
      return run(`gulp build-${target}-style-internal`).exec();
    });

    gulp.task(`build-${target}-scripts`, [
      `build-${target}-requirejs`,
      'lib',
      'update-common-js'
    ], function () {
      return gulp.src([`${target}/scripts/main.js`], { base: './' })
        .pipe(rjs());
    });

    gulp.task(`build-${target}-index`, ['template'], function () {
      return gulp.src([`${target}/index.html`])
        .pipe(replace(/\s*<script>[^<]*<\/script>/g, ''))
        .pipe(replace(/<html/, '<html manifest="manifest.appcache"'))
        .pipe(gulp.dest(`build/${target}/`));
    });

    gulp.task(`build-${target}-requirejs`, function () {
      return gulp.src([`${target}/scripts/require.js`])
        .pipe(gulp.dest(`build/${target}/scripts/`));
    });

    gulp.task(`build-${target}-images`, function () {
      return gulp.src([`${target}/images/{sprite,favicon}.png`])
        .pipe(gulp.dest(`build/${target}/images/`));
    });

    gulp.task(`build-${target}-inline`, [
      `build-${target}-images`,
      `build-${target}-index`,
      `build-${target}-scripts`,
      `build-${target}-style`
    ], function () {
      return gulp.src(`build/${target}/index.html`)
        .pipe(inlinesource({ compress: false }))
        .pipe(gulp.dest(`build/${target}/`));
    });
  });

  return ['build-static', 'build-boule', 'build-basic', 'build-tac'];
};
module.exports.targets = targets;
