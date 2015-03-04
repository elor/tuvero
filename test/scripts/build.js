({
  appDir: "..",
  baseUrl: "scripts",
  dir: "../../build/test",
  optimize: "uglify2",
  modules: [{
    name: "test"
  },{
    name: "testmain"
  }],
  optimizeCss: "none",
  findNestedDependencies: true,
  removeCombined: true,
  preserveLicenseComments: false,
  fileExclusionRegExp: /^\.|\.(svg|xcf|sh)$|^build\.js$/,
  mainConfigFile: ["config.js", "../../core/scripts/config.js"]
})
