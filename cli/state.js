#!/usr/bin/env node

"use strict";

const fs = require('fs');
const util = require('util');

const requirejs = require('requirejs');

function loadState(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (error, fileContents) => {
      if (error) {
        reject(error);
      } else {
        resolve(fileContents);
      }
    });
  })
    .then(parseState);
}

function parseState(savedState) {
  return new Promise((resolve, reject) => {
    if (util.isString(savedState)) {
      savedState = JSON.parse(savedState);
    }
    if (!util.isObject(savedState)) {
      return reject("incompatible data type. Must be JSON string or JSON");
    }

    if (!savedState.target) {
      return reject("No Tuvero target given. Is this even a Tuvero savestate?");
    }

    const target = savedState.target;
    const baseDir = `../${target}/scripts/`;

    requirejs.config({
      baseUrl: '../scripts',
      paths: {
        'options': baseDir + 'options',
        'presets': baseDir + 'presets',
        'strings': baseDir + 'strings'
      }
    });

    requirejs(['core/config'], function (config) {

      let StateModel = requirejs('ui/statemodel');
      let Listener = requirejs('core/listener');

      let State = new StateModel();

      Listener.bind(State, 'error', function (emitter, event, data) {
        reject(data);
      });

      if (State.restore(savedState)) {
        resolve(State);
      } else {
        reject("cannot restore saved state");
      }
    });
  });
}

exports.load = loadState;
exports.parse = parseState;
exports.commands = require('./commands.js');
