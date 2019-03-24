#!/usr/bin/env node

'use strict'

const fs = require('fs')

function loadState (file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (error, fileContents) => {
      if (error) {
        reject(error)
      } else {
        resolve(fileContents)
      }
    })
  })
    .then(parseState)
}

function parseState (savedState) {
  return new Promise((resolve, reject) => {
    if (typeof savedState === 'string') {
      savedState = JSON.parse(savedState)
    }
    if (typeof savedState !== 'object') {
      return reject(Error('incompatible data type. Must be JSON string or JSON'))
    }

    if (!savedState.target) {
      return reject(Error('No Tuvero target given. Is this even a Tuvero savestate?'))
    }

    const target = savedState.target
    const baseDir = `../${target}/scripts/`

    delete require.cache[require.resolve('requirejs')]
    const requirejs = require('requirejs')
    requirejs.config({
      baseUrl: '../scripts',
      paths: {
        'options': baseDir + 'options',
        'presets': baseDir + 'presets',
        'strings': baseDir + 'strings'
      }
    })

    requirejs(['core/config'], function (config) {
      let StateModel = requirejs('ui/statemodel')
      let Listener = requirejs('core/listener')

      let State = new StateModel()

      Listener.bind(State, 'error', function (emitter, event, data) {
        reject(data)
      })

      if (State.restore(savedState)) {
        resolve(State)
      } else {
        reject(Error('cannot restore saved state'))
      }
    })
  })
}

exports.load = loadState
exports.parse = parseState
exports.commands = require('./commands.js')
