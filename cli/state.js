#!/usr/bin/env node

"use strict";

var fs = require('fs');

function loadState(file, callback, errcallback) {
  callback = callback || console.log.bind(console);
  errcallback = errcallback || console.error.bind(console);

  try {
    var fileContents = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    errcallback('cannot read file ' + file);
    return;
  }

  parseState(fileContents, callback, errcallback);
}

function parseState(fileContents, callback, errcallback) {
  var requirejs = require('requirejs');

  if (typeof (fileContents) === "string") {
    try {
      fileContents = JSON.parse(fileContents);
    } catch (err) {
      errcallback(err);
    }
  }

  var target = fileContents.target;

  requirejs.config({
    baseUrl: '../scripts'
  });

  requirejs(['core/config'], function (config) {
    var myBase = '../' + target + '/scripts/';

    requirejs.config({
      paths: {
        'options': myBase + 'options',
        'presets': myBase + 'presets',
        'strings': myBase + 'strings'
      }
    });

    var State = requirejs('ui/state');

    try {
      State.restore(fileContents);
      callback(State);
    } catch (err) {
      errcallback(err);
    }
  });
}

exports.load = loadState;
exports.parse = parseState;
exports.commands = require('./commands.js')
