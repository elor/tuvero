'use strict'

var through = require('through2')
var Vinyl = require('vinyl')
var path = require('path')

module.exports = function () {
  var list = []

  function addToList (file, encoding, callback) {
    list.push(file.relative)

    callback()
  }

  function posixPath (csspath) {
    return csspath.replace(/\\/g, '/')
  }

  function formatImport (csspath) {
    return '@import url("' + csspath + '");'
  }

  // Called after all files have been passed
  function writeFile (callback) {
    var contents, file

    // create and join lines
    contents = list.map(posixPath).map(formatImport).join('\n') + '\n'

    // Create a Vinyl file
    file = new Vinyl({
      cwd: __dirname,
      base: path.join(__dirname),
      path: path.join(__dirname, 'mainstyle.css'),
      contents: Buffer.from(contents)
    })
    // Pass the Vinyl file on
    this.push(file)
    callback()
  }

  return through.obj(addToList, writeFile)
}
