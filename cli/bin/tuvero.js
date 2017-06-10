#!/usr/bin/env node

"use strict";

var path = require('path');
var fs = require('fs');
var libdir = path.join(path.dirname(fs.realpathSync(__filename)), '..');
var tuvero = require(libdir + path.sep + 'state.js');

var args = process.argv.slice(2);

function printandexit() {
  console.error('Syntax: tuvero.js <input.json> <command>');
  console.error('Commands:');
  console.error('    ' + Object.keys(tuvero.commands).sort().join(', '));
  process.exit(1);
}

if (args.length < 2) printandexit();

var filename = args.shift();
var command = args.shift();
var callback = tuvero.commands[command];

if (!command || !callback) printandexit();

var output = state => {
  console.log(JSON.stringify(callback(state), null, '  '));
};

var errput = (err) => {
  console.error(err);
  process.exit(1);
};

tuvero.load(filename)
  .then(output)
  .catch(errput);
