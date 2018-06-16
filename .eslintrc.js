module.exports = {
  root: true,
  env: {
    browser: true
  },
  rules: {
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    // VS Code / MSVS autoformat rules
    quotes: [2, "double"],
    semi: [2, "always"],
    "space-before-function-paren": [2, {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }],
    "valid-jsdoc": "error"
  }
};