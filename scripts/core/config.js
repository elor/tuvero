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
        'jquery': 'lib/jquery',
        'filesaver': 'lib/FileSaver'
    }
});
