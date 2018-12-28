'use strict'

/* jshint evil: true */

var through = require('through2')
var path = require('path')
var fs = require('fs')

module.exports = function () {
  var existant = {}

  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  function toFilePath (depPath) {
    return 'scripts/' + depPath + '.js'
  }

  function guessLoadPath (filePath) {
    var dir = path.dirname(filePath)
    var base = path.basename(filePath, '.js')
    var parts = dir.split(path.sep)
    parts.push(base)
    return parts.join('/')
  }

  function getRequiredDeps (contents) {
    var re = /(?:require|getModule)\(['"]([^)",]+)["']\)/g
    var match
    var deps = []

    while ((match = re.exec(contents))) {
      deps.push(match[1])
    }

    return deps
  }

  function readDependencies (contents) {
    function define (dependencies, callback) {
      if (isArray(dependencies)) {
        return dependencies
      }
    }
    var require = define
    require.config = function () { }

    return getRequiredDeps(contents).concat(eval(contents) || [])
  }

  function getDuplicates (array) {
    return array.slice().sort().filter(function (value, index, copy) {
      return index > 0 && value === copy[index - 1]
    })
  }

  function getRelativePaths (deps) {
    return deps.filter(function (depPath) {
      return /^\./.test(depPath)
    })
  }

  function checkExistance (deps) {
    return deps.filter(function (depPath) {
      return /^[^.]*\//.test(depPath) // remove local paths and aliased files. Can't resolve them unambiguously
    }).filter(function (depPath) {
      return !existant[depPath]
    }).filter(function (depPath) {
      if (fs.existsSync(toFilePath(depPath))) {
        existant[depPath] = true
        return false
      }
      return true
    })
  }

  function checkFile (file, encoding, done) {
    var loadPath = guessLoadPath(file.relative)

    if (!file.contents) {
      done('file cannot be read: ' + loadPath)
      return
    }

    if (!/define\(/.test(file.contents)) {
      done('file does not contain define function: ' + loadPath)
      return
    }

    var deps = readDependencies.call({}, file.contents.toString())
    if (deps === undefined || deps.length === 0) {
      // Not an error: There are files which don't require anything
      done()
      return
    }

    // Local Load Path Warning
    getRelativePaths(deps, loadPath).forEach(function (localPath) {
      console.warn('Warning: local path in file ' + loadPath + ': ' + localPath)
    })

    // Duplicates:
    var duplicates = getDuplicates(deps)
    if (duplicates.length !== 0) {
      done(['duplicate dependencies in file ' + loadPath + ':'].concat(duplicates).join('\r\n'))
      return
    }

    // Excessive Dependencies Warning
    if (deps.length > 8) {
      console.warn('Warning: too many dependencies in file ' + loadPath + ': ' + deps.length)
    }

    var missing = checkExistance(deps)
    if (missing.length !== 0) {
      done(['missing dependencies for file ' + loadPath + ':'].concat(missing).join('\r\n'))
      return
    }

    done()
  }

  // Called after all files have been passed
  function writeFile (done) {
    done()
  }

  return through.obj(checkFile, writeFile)
}
