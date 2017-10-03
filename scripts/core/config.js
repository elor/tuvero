/**
 * config.js: sets up the shared configuration of the projects
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
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
        },
        'lib/FileSaver': {
          exports: 'saveAs'
        }
    },
    paths: {
        'jquery': 'lib/jquery',
        'filesaver': 'lib/FileSaver'
    }
});
