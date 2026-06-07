import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = (...p) => resolve(fileURLToPath(new URL('.', import.meta.url)), ...p)

export default defineConfig({
  resolve: {
    alias: {
      options: here('test/scripts/options.js'),
      presets: here('test/scripts/presets.js'),
      strings: here('test/scripts/strings.js')
    }
  },
  test: {
    include: ['scripts/**/test/*.js'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['scripts/**/*.js'],
      exclude: ['scripts/**/test/*.js', 'scripts/ui/**', 'scripts/background/**']
    }
  }
})
