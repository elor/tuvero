({
    appDir: "..",
    baseUrl: "scripts",
    dir: "../../boules-build",
    optimize: "uglify2",
    modules: [
        {
            name: 'lib/FileSaver',
        },
        {
            name: 'common',
            exclipde: ['lib/FileSaver']
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
  shim: {
    'lib/modernizr' : {
      deps: ['lib/Blob'],
      exports: 'Modernizr'
    },
      'lib/Blob' : {
      exports: 'Blob'
    },
    'lib/qunit' : {
      exports: 'QUnit',
      /**
      * disable QUnit autoload/autostart for requirejs optimizer compatibility
      */
      init: function() {
        QUnit.config.autoload = false;
        QUnit.config.autostart = false;
      }
    }
  },
  paths: {
    'jquery': 'lib/jquery'
  }
})
