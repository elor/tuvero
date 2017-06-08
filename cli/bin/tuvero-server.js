#!/usr/bin/env node

"use strict";

var path = require('path');
var fs = require('fs');
var libdir = path.join(path.dirname(fs.realpathSync(__filename)), '..');
var tuvero = require(libdir + path.sep + 'state.js');
const express = require('express');

const PORT = 8080;
const app = express();
app.post('/', function (request, response) {
  request.on('data', function (data) {
    console.log(data.toString());
  })
  response.send(request.body);
});

app.listen(PORT);
