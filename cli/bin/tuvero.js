#!/usr/bin/env node

"use strict";

var path = require('path');
var fs = require('fs');
var libdir = path.join(path.dirname(fs.realpathSync(__filename)), '..');
var tuvero = require(libdir + path.sep + 'state.js');

var args = process.argv.slice(2);

if (args.length < 2) {
    console.error('Syntax: tuvero.js <input.json> <command>');
    process.exit(1);
}

var filename = args.shift();
var command = args.shift();
var callback = undefined;

switch (command) {
    case 'format':
        callback = state => state.save();
        break;
    case 'ranking':
        callback = state => state.tournaments.getGlobalRanking(state.teams.length);
        break;
    case 'teams':
        callback = state => state.teams.save();
        break;
    default:
        console.error(command + ': command not found');
        process.exit(1);
}

var errback = function(err) {
    console.error(err);
    process.exit(1);
};

var logToConsole = state => console.log(JSON.stringify(callback(state)));

tuvero.load(filename, logToConsole, errback);
