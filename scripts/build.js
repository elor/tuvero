({
    appDir: "..",
    baseUrl: "scripts",
    dir: "../../boules-build",
    optimize: "uglify2",
    modules: [
        {
            name: 'common',
        },
        {
            name: "main",
            exclude: ['common'],
        },
        {
            name: "test",
            exclude: ['common'],
        },
    ],
    findNestedDependencies: true,
    removeCombined: true,
    fileExclusionRegExp: /^\.|\.(svg|xcf|sh)$|^build\.js$/,
  shim : {
    'lib/modernizr' : {
      deps: ['lib/Blob'],
      exports: 'Modernizr'
    },
      'lib/Blob' : {
      exports : 'Blob'
    },
      'lib/typeahead' : {
      deps: [ 'lib/jquery' ]
    },
    'lib/jsPlumb' : {
      deps: ['lib/jquery'],
      exports: 'jsPlumb'
    },
    'lib/qunit' : {
      exports: 'QUnit',
      init: function() {
        QUnit.config.autoload = false;
        QUnit.config.autostart = false;
      }
    }
  },
})
