#!/usr/bin/env node

"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const libdir = path.join(path.dirname(fs.realpathSync(__filename)), '..');
const tuvero = require(libdir + path.sep + 'state.js');

const app = express();

app.use(bodyParser.json({ type: 'application/json' }));

function formatError(error) {
  return JSON.stringify({
    'error': 'Error while processing the request',
    'message': error ? (error.message || error.msg || error) : ''
  }, null, '  ');
}

var router = express.Router();

router.post('/:command', function (request, response, next) {
  let command = request.params.command || undefined;

  if (!command) {
    response.status(400).send(formatError('No command given. Try /teams'));
  } else if (!tuvero.commands[command]) {
    response.status(400).send(formatError(`command ${command} not known. Try /teams`));
  } else if (!request.headers['content-type']) {
    response.status(400).send(formatError('No content-type given. content-type must be application/json'));
  } else if (request.headers['content-type'] !== 'application/json') {
    response.status(400).send(formatError('No content-type given. content-type must be application/json'));
  } else {
    try {
      tuvero.parse(request.body, function (state) {
        let result = tuvero.commands[command](state);
        response.send(JSON.stringify(result, null, '  '));
      }, function (error) {
        response.status(400).send(formatError(error));
      });
    } catch (err) {
      response.status(400).send(formatError(err));
    }
  }

});

app.use('/', router);

app.listen(8080);
