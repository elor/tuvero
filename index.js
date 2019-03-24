#!/usr/bin/env node

'use strict'

var tuvero = require('./cli/state.js')

exports.load = tuvero.load
exports.parse = tuvero.parse
exports.commands = tuvero.commands

exports.http = function (request, response) {
  const { state: saveState, command } = JSON.parse(request.body)

  if (!tuvero.commands[command]) {
    throw Error(`Unknown tuvero command: ${command}.
Must be one of: ${Object.keys(tuvero.commands).join(', ')}`)
  }

  tuvero.parse(saveState)
    .then(tuvero.commands[command])
    .then((result) => {
      const resultString = JSON.stringify(result)
      response.status(200).send(resultString)
    })
    .catch(error => {
      console.error(error)
      response.status(400).send(error)
    })
}

exports.event = (event, callback) => {
  callback()
}
