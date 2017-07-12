var sources = {
  styles: [
    'lib/*.css',
    'style/**/*.css',
    '!style/mainstyle.css'
  ],
  scripts_and_tests: [
    'scripts/**/*.js',
    '!scripts/core/{common,config,main}.js',
    '!**/lib/*.js'
  ],
  scripts: [
    'scripts/*/*.js',
    '!scripts/core/{common,config,main}.js',
    '!**/{lib,test}/*.js'
  ],
  scripts_for_linting: [
    '*.js',
    'gulp-tools/*.js',
    'scripts/**/*.js',
    '*/scripts/**/*.js',
    '!*/scripts/**/build.js',
    '!**/lib/*.js',
    '!**/{require,qunit}.js'
  ],
  dependent_scripts: [
    'scripts/*/*.js',
    '{basic,boule,tac,test}/scripts/{presets,options,strings}.js',
    'scripts/**/test/*.js',
    '!scripts/core/{common,config,main}.js',
    '!**/lib/*.js'
  ],
  tests: ['scripts/**/test/*.js'],
  templates: 'templates/*.html',
  template_index: 'templates/index.html',
  release_source_cleanup: [
    '*',
    '.{jshintrc,dockerignore,travis.yml}',
    '!build',
    '!gulpfile.js',
    '!gulp-tools',
    '!node_modules',
    '!LICENSE',
    '!README*'
  ],
  release_final_cleanup: [
    'build',
    'gulpfile.js',
    'gulp-tools',
    'node_modules',
    '.gitignore'
  ]
};

module.exports = sources;
