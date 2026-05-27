const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')

module.exports = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      'no-var': 'error',
      'prefer-const': 'error'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
)
