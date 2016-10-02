({
  appDir: "..",
  baseUrl: "scripts",
  dir: "../../build/tac",
  optimize: "none",
  modules: [{
    name: "main"
  }],
  optimizeCss: "none",
  findNestedDependencies: true,
  removeCombined: true,
  preserveLicenseComments: false,
  fileExclusionRegExp: /^\.|\.(svg|xcf|sh)$|^build\.js$/,
  mainConfigFile: ["main.js", "../../core/scripts/config.js"]
})
