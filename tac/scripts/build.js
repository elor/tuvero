({
  appDir: "..",
  baseUrl: "scripts",
  dir: "../../tac-build",
  optimize: "uglify2",
  modules: [{
    name: "main"
  }],
  optimizeCss: "none",
  findNestedDependencies: true,
  removeCombined: true,
  preserveLicenseComments: false,
  fileExclusionRegExp: /^\.|\.(svg|xcf|sh)$|^build\.js$/,
  mainConfigFile: ["config.js", "../../core/scripts/config.js"]
})
