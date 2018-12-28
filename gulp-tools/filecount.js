'use strict'

var through = require('through2')

module.exports = function (minimum, maximum, verbose) {
  minimum = minimum || 1
  maximum = maximum || undefined
  verbose = verbose || false
  var numFiles = 0

  function transform (file, encoding, callback) {
    numFiles += 1

    this.push(file)

    callback()
  }

  function flush (callback) {
    if (verbose) {
      console.log('processing ' + numFiles + ' files')
    }

    if (maximum !== undefined && minimum > maximum) {
      callback(new Error('Parameter Error: Minimum > Maximum'))
      return
    }

    if (numFiles === 0) {
      callback(new Error('No src files found!'))
    } else if (numFiles < minimum) {
      callback(new Error('Not enough files found: ' + numFiles + '/' + minimum))
    } else if (maximum !== undefined && numFiles > maximum) {
      callback(new Error('Too many files found: ' + numFiles + '/' + maximum))
    } else {
      callback()
    }
  }

  return through.obj(transform, flush)
}
