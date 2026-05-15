const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const package = require("./package.json");

/**
 * @param target var, umd, commonjs2, commonjs, amd, this, assign, window, global or jsonp
 */
const makeConfig = target => ({
  entry: package.main,
  output: {
    filename: `tuvero.bundle-${target}.js`,
    path: path.resolve(__dirname, "dist"),
    libraryTarget: target,
    library: package.name
  },
  plugins: [
    new UglifyJSPlugin()
  ]
});

module.exports = [
  makeConfig("amd"),
  makeConfig("var"),
  makeConfig("commonjs2"),
  makeConfig("commonjs"),
  makeConfig("window")
]
