'use strict'

const fs = require('fs')
const path = require('path')
const nunjucks = require('gulp-nunjucks')
const filecount = require('./filecount')

const targets = ['basic', 'boule', 'tac']

function templateStrings (target) {
  delete require.cache[require.resolve('requirejs')]
  const requirejs = require('requirejs')
  requirejs.config({
    baseUrl: 'scripts',
    paths: {
      'options': `../${target}/scripts/options`,
      'presets': `../${target}/scripts/presets`,
      'strings': `../${target}/scripts/strings`
    },
    nodeRequire: require
  })

  const strings = requirejs('ui/strings')
  strings.version = require('./version')
  return strings
}

function register (gulp, sources) {
  targets.forEach(function (target) {
    const targetTemplatesDir = path.join(target, 'templates')
    const targetTemplates = `${target}/templates/*.html`
    const tempTemplateDir = `tmp/templates/${target}/`
    const templateGlobs = fs.existsSync(targetTemplatesDir)
      ? [sources.templates, targetTemplates]
      : [sources.templates]

    gulp.task(`template-${target}-sources`, function templateSources () {
      return gulp.src(templateGlobs)
        .pipe(filecount())
        .pipe(gulp.dest(tempTemplateDir))
    })

    gulp.task(`template-${target}-internal`, function templateInternal () {
      return gulp.src(tempTemplateDir + '/index.html')
        .pipe(filecount())
        .pipe(nunjucks.compile(templateStrings(target)))
        .pipe(filecount())
        .pipe(gulp.dest(target))
    })

    gulp.task(
      `template-${target}`,
      gulp.series(`template-${target}-sources`, `template-${target}-internal`)
    )
  })
}

module.exports = { register, targets }
