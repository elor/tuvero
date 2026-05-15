import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = (...p) => resolve(fileURLToPath(new URL('.', import.meta.url)), ...p)

export default defineConfig({
  resolve: {
    alias: {
      filesaver: 'file-saver',
      options: here('basic/scripts/options.js'),
      presets: here('basic/scripts/presets.js'),
      strings: here('basic/scripts/strings.js')
    }
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        basic: here('basic/index.html'),
        boule: here('boule/index.html'),
        tac: here('tac/index.html')
      }
    }
  }
})
