#!/usr/bin/env node

"use strict";

var fs = require('fs');

function loadState(file, callback, errcallback) {
    var requirejs = require('requirejs');

    callback = callback || console.log.bind(console);
    errcallback = errcallback || console.error.bind(console);

    try {
        var fileContents = JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch (e) {
        errcallback('cannot read file ' + file);
        return;
    }

    var target = fileContents.target;

    requirejs.config({
        baseUrl: '../scripts'
    });

    requirejs(['core/config'], function(config) {
        var myBase = '../' + target + '/scripts/';

        requirejs.config({
            paths: {
                'options': myBase + 'options',
                'presets': myBase + 'presets',
                'strings': myBase + 'strings'
            }
        });

        var State = requirejs('ui/state');

        fs.readFile(file, { encoding: 'utf-8' }, function(err, data) {
            if (err) {
                errcallback(err);
            } else {
                State.restore(JSON.parse(data));
                callback(State);
            }
        });
    });
}

exports.load = loadState;
