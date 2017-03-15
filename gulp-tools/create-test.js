'use strict';

var through = require('through2');
var File = require('gulp-util').File;
var path = require('path');
var fs = require('fs');

module.exports = function () {
    var list = [];

    // TODO read from core config
    var mapping = {
        'core/scripts/test': 'core/test',
        'legacy/scripts/ui/test': 'ui/test',
        'legacy/scripts/ui/backgroundscripts/test': 'ui/backgroundscripts/test',
        'legacy/scripts/timemachine/test': 'timemachine/test'
    };

    function addToList(file, encoding, callback) {
        var dir, base;

        dir = path.dirname(file.relative).replace(new RegExp('\\' + path.sep, 'g'), '/');
        base = path.basename(file.relative, '.js');

        dir = mapping[dir] || dir;

        list.push(dir + '/' + base);

        callback();
    }

    // Called after all files have been passed
    function writeFile(callback) {
        var contents, file, modules;

        modules = list.map(function (module) {
            return "  '" + module + "'";
        }).join(',\n');

        // create and join lines
        contents = fs.readFileSync('gulp-tools/templates/test.js', 'utf-8');
        contents = contents.replace('{ modules }', modules);

        // Create a Vinyl file
        file = new File({
            cwd: __dirname,
            base: path.join(__dirname, 'test', 'scripts', 'test'),
            path: path.join(__dirname, 'test', 'scripts', 'test', 'test.js'),
            contents: new Buffer(contents)
        });
        // Pass the Vinyl file on
        this.push(file);
        callback();
    }

    return through.obj(addToList, writeFile);
};
