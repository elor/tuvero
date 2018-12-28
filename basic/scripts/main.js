/**
 * First file to load. Contains the non-core config and loads the shared main
 * file. Target-specific modules can be loaded and executed from here
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
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
  paths: {
    'options': '../basic/scripts/options',
    'presets': '../basic/scripts/presets',
    'strings': '../basic/scripts/strings'
  }
})

require(['core/main'], function () {
  // load target-specific modules here. But please don't try to
})
