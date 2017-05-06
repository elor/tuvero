/**
 * common.js: loads each requirejs-compatible script file (except tests) and
 * configures requirejs to load libraries as shims
 *
 * This file is automatically generated as part of the build process.
 * Do not attempt manual changes
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
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
