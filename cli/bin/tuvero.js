#!/usr/bin/env node

import { load, commands } from '../state.js'

function printAndExit () {
  console.error('Syntax: tuvero <input.json> <command>')
  console.error('Commands:')
  console.error('    ' + Object.keys(commands).sort().join(', '))
  process.exit(1)
}

const [filename, command] = process.argv.slice(2)

if (!filename || !command || !commands[command]) printAndExit()

load(filename, command)
  .then(result => console.log(JSON.stringify(result, null, '  ')))
  .catch(err => { console.error(err.message || err); process.exit(1) })
