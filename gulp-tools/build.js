'use strict'

const gulp = require('gulp')
const filecount = require('./filecount')
const buildstyle = require('./buildstyle')
const replace = require('gulp-replace')
const rjs = require('./rjs-optimize')
const inlinesource = require('gulp-inline-source')
const terser = require('gulp-terser')

const targets = ['basic', 'boule', 'tac', 'test']

function register (gulp, sources) {
  targets.forEach(function (target) {
    gulp.task(
      `build-${target}-style-internal`,
      buildstyle(`${target}/style`, `tmp/${target}/style`)
    )

    gulp.task(
      `build-${target}-style`,
      gulp.series('update-mainstyle', `build-${target}-style-internal`)
    )

    gulp.task(
      `build-${target}-scripts`,
      gulp.series('lib', 'update-common-js', function buildScripts () {
        return gulp.src([`${target}/scripts/{test,main}.js`], { base: './' })
          .pipe(rjs({ outDir: 'tmp' }))
      })
    )

    if (target === 'test') {
      gulp.task(`build-${target}-html`, function buildTestHtml (cb) { cb() })
    } else {
      gulp.task(
        `build-${target}-html`,
        gulp.series('template', function buildHtml () {
          return gulp.src([`${target}/*.html`])
            .pipe(replace(/\s*<script>[^<]*<\/script>/g, ''))
            .pipe(gulp.dest(`tmp/${target}/`))
        })
      )
    }

    gulp.task(
      `build-${target}-requirejs`,
      gulp.series('lib-requirejs', function buildRequirejs () {
        return gulp.src([`${target}/scripts/require.js`])
          .pipe(filecount())
          .pipe(terser())
          .pipe(gulp.dest(`tmp/${target}/scripts/`))
      })
    )

    gulp.task(`build-${target}-images`, function buildImages () {
      return gulp.src([`${target}/images/{sprite,favicon}.png`], { encoding: false })
        .pipe(gulp.dest(`tmp/${target}/images/`))
    })

    gulp.task(
      `build-${target}-inline`,
      gulp.series(
        gulp.parallel(
          `build-${target}-images`,
          `build-${target}-html`,
          `build-${target}-requirejs`,
          `build-${target}-scripts`,
          `build-${target}-style`
        ),
        function buildInline () {
          if (target === 'test') {
            return gulp.src([`tmp/${target}/{*.html,scripts/*.js,style/*.css,images/*.png}`], { encoding: false })
              .pipe(gulp.dest(`build/${target}/`))
          }
          return gulp.src(`tmp/${target}/*.html`)
            .pipe(inlinesource({ compress: false }))
            .pipe(gulp.dest(`build/${target}/`))
        }
      )
    )

    gulp.task(`build-${target}`, gulp.series(`build-${target}-inline`))
  })
}

module.exports = { register, targets }
