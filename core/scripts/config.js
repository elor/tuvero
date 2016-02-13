/**
 * config.js: sets up the shared configuration of the projects
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

require.config({
  shim: {
    'lib/modernizr': {
      deps: ['lib/Blob'],
      exports: 'Modernizr'
    },
    'lib/typeahead': {
      deps: ['jquery']
    },
    'lib/Blob': {
      exports: 'Blob'
    }
  },
  paths: {
    /**
     * All paths are relative to the baseUrl, not this config file, hence the
     * '../../'
     *
     * Unfortunately, they cannot be auto-generated within the script due to its
     * use as r.js config file. Since this is a shared file, the target/build
     * folders need to share the same parent directory, i.e. the project root.
     */
    'lib': '../../lib',
    'ui': '../../legacy/scripts/ui',
    'timemachine' : '../../legacy/scripts/timemachine',
    'backend': '../../legacy/scripts/backend',
    'jquery': '../../lib/jquery',
    'filesaver': '../../lib/FileSaver'
  }
});
