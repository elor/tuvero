#!/usr/bin/env node

"use strict";

var fs = require('fs');
var requirejs = require('requirejs')

requirejs.config({
    baseUrl: 'scripts',
    paths: {
        'core': '../../core/scripts/'
    },
    nodeRequire: require
});

requirejs(['core/config'], function (config) {
    var myBase = '../../test/scripts/';

    requirejs.config({
        paths: {
            'options': myBase + 'options',
            'presets': myBase + 'presets',
            'strings': myBase + 'strings'
        }
    });

    var State = requirejs('ui/state');

    fs.readFile(file, { encoding: 'utf-8' }, function (err, data) {
        if (err) {
            errcallback(err)
        } else {
            State.restore(JSON.parse(data));
            callback(State);
        }
    });
});
