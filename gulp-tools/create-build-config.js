"use strict";

var through = require("through2");
var File = require("gulp-util").File;
var path = require("path");
var fs = require("fs");


module.exports = function () {
  var targets = [];

  function scriptConfig(target) {
    var outputDir = "build/config";
    var scriptPath = path.posix.relative(outputDir, "scripts");
    var outPath = path.posix.relative(outputDir, `build/${target}/scripts/`);

    return {
      baseUrl: scriptPath,
      mainConfigFile: [
        path.posix.relative(outputDir, `${target}/scripts/main.js`),
        `${scriptPath}/core/config.js`
      ],
      name: path.posix.relative("scripts", `${target}/scripts/main`),
      out: `${outPath}/main.js`,
      preserveLicenseComments: false
    };
  }

  // Called for every file in the stream
  function processFile(file, encoding, callback) {
    var dir, base, dirParts, target, contents;

    dir = path.dirname(file.relative);
    base = path.basename(file.relative, ".js");

    dirParts = dir.split(path.sep);

    switch (false) {
      case dirParts.length === 2:
      case dirParts[1] === "scripts":
      case base === "main":
        callback("input file does not match '<target>/scripts/main.js': " + file.relative);
    }

    target = dirParts[0];
    targets.push(target);

    contents = JSON.stringify(scriptConfig(target), null, "  ");

    file = new File({
      cwd: __dirname,
      base: path.join(__dirname, "build", "config"),
      path: path.join(__dirname, "build", "config", `${target}.js`),
      contents: new Buffer(`(${contents})`)
    });

    this.push(file);

    callback();
  }

  // Called after all files have been passed
  function finalize(callback) {
    var contents, file, modules;

    if (targets.length === 0) {
      callback("No input files");
    }

    callback();
  }

  return through.obj(processFile, finalize);
};
