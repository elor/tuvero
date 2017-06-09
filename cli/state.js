#!/usr/bin/env node

"use strict";

const fs = require('fs');

function loadState(file, callback, errcallback) {
  callback = callback || console.log.bind(console);
  errcallback = errcallback || console.error.bind(console);

  try {
    const fileContents = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    errcallback('cannot read file ' + file);
    return;
  }

  parseState(fileContents, callback, errcallback);
}

function parseState(fileContents, callback, errcallback) {
  let requirejs = require('requirejs');

  if (typeof (fileContents) === "string") {
    try {
      fileContents = JSON.parse(fileContents);
    } catch (err) {
      errcallback(err);
    }
  }

  const target = fileContents.target;

  requirejs.config({
    baseUrl: '../scripts'
  });

  requirejs(['core/config'], function (config) {
    const baseDir = '../' + target + '/scripts/';

    requirejs.config({
      paths: {
        'options': baseDir + 'options',
        'presets': baseDir + 'presets',
        'strings': baseDir + 'strings'
      }
    });

    let StateModel = requirejs('ui/statemodel');
    let State = new StateModel();


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
