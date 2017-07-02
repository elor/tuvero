"use strict";

var through = require("through2");
var path = require("path");
var requirejs = require('requirejs');

module.exports = function (options) {
  let outDir = options.outDir || "build";

  function scriptConfig(target) {

    return {
      baseUrl: "scripts",
      mainConfigFile: [
        `${target}/scripts/main.js`,
        "scripts/core/config.js"
      ],
      name: path.posix.relative("scripts", `${target}/scripts/main`),
      out: `${outDir}/${target}/scripts/main.js`,
      preserveLicenseComments: false
    };
  }

  // Called for every file in the stream
  function processFile(file, encoding, callback) {
    var dir, base, dirParts, target, config;

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

    config = scriptConfig(target);

    requirejs.optimize(config, function (success) {
      callback();
    }, function (err) {
      callback(err);
    });

  }

  // Called after all files have been passed
  function finalize(callback) {
    callback();
  }

  return through.obj(processFile, finalize);
};
