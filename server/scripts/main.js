/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

var requirejs=require('requirejs')
var fs = require('fs');

requirejs.config({
    baseUrl: 'scripts',
    paths: {
        'core': '../../core/scripts/'
    },
    nodeRequire: require
});

requirejs(['core/config'], function(config) {
    var State = requirejs('ui/state');

    fs.readFile('/home/elor/Desktop/testturnier.json', {encoding: 'utf-8'}, function(err, data) {
        if (!err) {
            State.restore(JSON.parse(data));
            State.tournaments.get(7).run();
            console.log(JSON.stringify(State.save()));
        } else {
            console.log('File read error: ');
            console.log(err);
        }
    });
});
