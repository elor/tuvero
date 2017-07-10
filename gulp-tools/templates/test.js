/**
 * Run every available test
 *
 * This file is automatically created on build. Do not attempt manual changes
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

/**
 * All non-core configuration is required to be included in main.js before the
 * first call to require(), which starts the actual program. It is required by
 * the build script. See build.js and build.sh.
 */
require.config({
  baseUrl: '../scripts',
  shim: {
    'qunit': {
      exports: 'QUnit',
      /**
       * disable QUnit autoload/autostart for requirejs optimizer compatibility
       */
      init: function () {
        QUnit.config.autoload = false;
        QUnit.config.autostart = false;
      }
    }
  },
  paths: {
    'options': '../test/scripts/options',
    'presets': '../test/scripts/presets',
    'strings': '../test/scripts/strings',
    'qunit': '../test/scripts/qunit'
  }
});

require(['core/config', 'core/common', 'qunit',
  { modules }
], function (Config, Common, QUnit) {
  var i, group, currentGroup, dependencies;

  dependencies = Object.keys(require.s.contexts._.defined).filter(function (name) {
    return /^.+\/test\/[^/]+$/.test(name);
  });

  for (i = 0; i < dependencies.length; i += 1) {
    try {
      currentGroup = dependencies[i].match(/^[^/]+/)[0];
      console.log(currentGroup);
      if (group !== currentGroup) {
        group = currentGroup;
        QUnit.module(group);
      }
      Common(dependencies[i])(QUnit, Common);
    } catch (e) {
      QUnit.test('Loading Error', function () {
        var source = e.stack.split('\n')[2].replace(/^ *at */, '')
          .replace(/\?bust=[0-9]*/, '');
        console.error(e.message);
        console.error(source);
        QUnit.ok(false, 'cannot load module ' +
          e.message.match(/"[^"]+"/) + '. Possible typo?\n' +
          source);
      });
    }
  }
  QUnit.load();
  QUnit.start();
});
