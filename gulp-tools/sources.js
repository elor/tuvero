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
    '{basic,boule,tac,test}/**/*',
    'bower_components/**/*',
    '{bower.json,ChangeLog,Dockerfile}',
    'index.html',
    '{core,tmp,tools}/**/*',
    '{script,images,style,templates}/**/*',
    '{cli,mobile,doc}/**/*',
    '.{jshintrc,dockerignore,travis.yml}',
  ],
  release_final_cleanup: [
    'package.json',
    'gulpfile.js',
    'node_modules/**/*',
    'gulp-tools/**/*',
    '{tuvero.njsproj,tuvero.sln}',
  ]
};

module.exports = sources;
