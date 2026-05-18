var sources = {
  styles: [
    'lib/*.css',
    'style/**/*.css',
    '!style/mainstyle.css'
  ],
  scripts_for_standardjs: [
    'scripts/**/*.js',
    '*.js',
    'gulp-tools/*.js',
    '*/scripts/**/*.js',
    '!**/lib/*.js',
    '!scripts/core/common.js',
    '!*/scripts/**/{build,test}.js',
    '!**/{require,qunit}.js'
  ]
}

module.exports = sources
