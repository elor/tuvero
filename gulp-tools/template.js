'use strict'

var gulp = require('gulp')
var run = require('gulp-run')
var nunjucks = require('gulp-nunjucks')
var filecount = require('./filecount')

function templateStrings (target) {
  var requirejs = require('requirejs').config({
    baseUrl: 'scripts',
    paths: {
      'options': `../${target}/scripts/options`,
      'presets': `../${target}/scripts/presets`,
      'strings': `../${target}/scripts/strings`
    },
    nodeRequire: require
  })

  var strings = requirejs('ui/strings')
  strings.version = require('./version')

  return strings
}

module.exports = function (target, sources) {
  let targetTemplates = `${target}/templates/*.html`
  let tempTemplateDir = `tmp/templates/${target}/`

  gulp.task(`template-${target}-sources`, function () {
    return gulp.src([sources.templates, targetTemplates])
      .pipe(filecount())
      .pipe(gulp.dest(tempTemplateDir))
  })

  gulp.task(`template-${target}-internal`, function () {
    return gulp.src(tempTemplateDir + '/index.html')
      .pipe(filecount())
      .pipe(nunjucks.compile(templateStrings(target)))
      .pipe(filecount())
      .pipe(gulp.dest(target))
  })

  gulp.task(`template-${target}`, [`template-${target}-sources`], function () {
    return run(`gulp template-${target}-internal`).exec()
  })

  return `template-${target}`
}

module.exports.targets = ['basic', 'boule', 'tac']
