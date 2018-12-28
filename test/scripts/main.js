/**
 * prepares the test environment
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

/* globals TestMain */

/**
 * All non-core configuration is required to be included in main.js before the
 * first call to require(), which starts the actual program. It is required by
 * the build script. See build.js and build.sh.
 */
require.config({
  baseUrl: '../scripts',
  paths: {
    'options': '../test/scripts/options',
    'presets': '../test/scripts/presets',
    'strings': '../test/scripts/strings'
  }
})

require(['core/config', 'core/common'], function (Config, Common) {
  var $ = require('jquery')
  TestMain(Common, $)
})
