#!/usr/bin/env node

'use strict'

const path = require('path')
const fs = require('fs')

const libdir = path.join(path.dirname(fs.realpathSync(__filename)), '..')
const tuvero = require(path.join([libdir, 'state.js']))

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
const callback = tuvero.commands[command]

if (!command || !callback) printandexit()

const output = (state) => {
  console.log(JSON.stringify(callback(state), null, '  '))
}

const errput = (err) => {
  console.error(err)
  process.exit(1)
}

tuvero.load(filename)
  .then(output)
  .catch(errput)
