#!/usr/bin/env node

"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const libdir = path.join(path.dirname(fs.realpathSync(__filename)), '..');
const tuvero = require(libdir + path.sep + 'state.js');

const app = express();

const PORT = 8080;

app.use(bodyParser.json({ type: 'application/json' }));

function formatError(error) {
  return JSON.stringify({
    'error': 'Error while processing the request',
    'message': error ? error.message || error.msg || error : ''
  }, null, '  ');
}

let router = express.Router();

const allCommands = Object.keys(tuvero.commands);

router.post('/:command', function (request, response, next) {
  let command = request.params.command || undefined;
  let id = `${request.ip}->{${request.path}`;

  (new Promise((resolve, reject) => {
    if (!command || !tuvero.commands[command]) {
      return reject("Command not recognized. Available commands: " + allCommands.join(', '));
    }
    if (!request.is("application/json")) {
      return reject("Content-Type must be application/json");
    }
    if (!request.body) {
      return reject("No JSON data received");
    }

    tuvero.parse(request.body)
      .then(state => {
        resolve(JSON.stringify(tuvero.commands[command](state), null, ' '));
      }).catch(reject);
  }))
    .then(json => {
      response.send(json);
    }).catch(error => {
      response.status(400).send(formatError(error));
    });
});

app.use('/', router);

app.listen(PORT);

console.log("listening on port " + PORT);
