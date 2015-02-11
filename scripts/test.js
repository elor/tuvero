/**
 * Run every available test
 *
 * This file is automatically created on build. Do not attempt manual changes
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

require.config({
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
    'jquery': 'lib/jquery',
    'filesaver': 'lib/FileSaver'
  }
});

define(['common',
        'lib/qunit',
         './backend/test/gameresultscorrection',
         './backend/test/kotournament',
         './backend/test/map',
         './backend/test/matrix',
         './backend/test/random',
         './backend/test/ranking',
         './backend/test/rleblobber',
         './backend/test/swisstournament',
         './backend/test/vector',
         './ui/test/blobs',
         './ui/test/csv',
         './ui/test/emitter',
         './ui/test/indexedlistmodel',
         './ui/test/indexedmodel',
         './ui/test/listcollectormodel',
         './ui/test/listmodel',
         './ui/test/model',
         './ui/test/playermodel',
         './ui/test/tab',
         './ui/test/teammodel',
         './ui/test/valuemodel'], function(Common, QUnit) {
  var i;
  for (i = 2; i < arguments.length; i += 1) {
    arguments[i](QUnit, Common);
  }
  QUnit.load();
  QUnit.start();
});
