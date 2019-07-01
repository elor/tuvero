#!/usr/bin/env node

'use strict'

var path = require('path')
var fs = require('fs')

var libdir = path.join(path.dirname(fs.realpathSync(__filename)), '..')
var tuvero = require(path.join([libdir, 'state.js']))

function printandexit () {
  console.error('Syntax: tuvero.js <input.json> <command>')
  console.error('Commands:')
  console.error('    ' + Object.keys(tuvero.commands).sort().join(', '))
  process.exit(1)
}

if (process.argv.length < 2) {
  printandexit()
}

const [filename, command] = process.argv
var callback = tuvero.commands[command]

if (!command || !callback) printandexit()

var output = (state) => {
  console.log(JSON.stringify(callback(state), null, '  '))
}

var errput = (err) => {
  console.error(err)
  process.exit(1)
}

tuvero.load(filename)
  .then(output)
  .catch(errput)
