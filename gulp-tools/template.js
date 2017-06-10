'use strict';

var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
var filecount = require('./filecount');

function templateStrings(target) {
  var requirejs = require('requirejs').config({
    baseUrl: 'scripts',
    paths: {
      options: `../${target}/scripts/options`,
      presets: `../${target}/scripts/presets`,
      strings: `../${target}/scripts/strings`
    },
    nodeRequire: require
  });

  var strings = requirejs('ui/strings');
  strings.version = require('./version');

  return strings;
}

module.exports = function (target, sources) {
  let target_templates = `${target}/templates/*.html`;
  let temp_template_dir = `tmp/templates/${target}/`;

  gulp.task(`template-${target}-sources`, function () {
    return gulp.src([sources.templates, target_templates])
      .pipe(filecount())
      .pipe(gulp.dest(temp_template_dir));
  });

  gulp.task(`template-${target}`, [`template-${target}-sources`],
    function () {
      return gulp.src(temp_template_dir + '/index.html')
        .pipe(filecount())
        .pipe(nunjucks.compile(templateStrings(target)))
        .pipe(filecount())
        .pipe(gulp.dest(target));
    });

  return `template-${target}`;
};
