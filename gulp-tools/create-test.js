'use strict'

var through = require('through2')
var Vinyl = require('vinyl')
var path = require('path')
var fs = require('fs')

module.exports = function () {
  var list = []

  function addToList (file, encoding, callback) {
    var dir, base, parts

    dir = path.dirname(file.relative)
    base = path.basename(file.relative, '.js')

    parts = dir.split(path.sep)
    parts.push(base)

    list.push(parts.join('/'))

    callback()
  }

  // Called after all files have been passed
  function writeFile (callback) {
    var contents, file, modules

    modules = list.map(function (module) {
      return "  '" + module + "'"
    }).join(',\n')

    // create and join lines
    contents = fs.readFileSync('gulp-tools/templates/test.js', 'utf-8')
    contents = contents.replace('{ modules }', modules)

    // Create a Vinyl file
    file = new Vinyl({
      cwd: __dirname,
      base: path.join(__dirname, 'test', 'scripts', 'test'),
      path: path.join(__dirname, 'test', 'scripts', 'test', 'test.js'),
      contents: Buffer.from(contents)
    })
    // Pass the Vinyl file on
    this.push(file)
    callback()
  }

  return through.obj(addToList, writeFile)
}
