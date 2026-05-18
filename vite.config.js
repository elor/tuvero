import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = (...p) => resolve(fileURLToPath(new URL('.', import.meta.url)), ...p)

const variant = process.env.VITE_VARIANT || 'basic'
const validVariants = ['basic', 'boule', 'tac']
if (!validVariants.includes(variant)) {
  throw new Error(`Unknown VITE_VARIANT="${variant}". Must be one of: ${validVariants.join(', ')}`)
}

export default defineConfig({
  resolve: {
    alias: {
      options: here(`${variant}/scripts/options.js`),
      presets: here(`${variant}/scripts/presets.js`),
      strings: here(`${variant}/scripts/strings.js`),
      // libtuvero workspace declares dist/index.mjs in exports but only
      // ships dist/index.js (CJS); alias to the CJS file until Phase #6
      // retires libtuvero's webpack step and adds a proper ESM build.
      tuvero: here('libtuvero/dist/index.js')
    }
  },
  build: {
    outDir: `build/${variant}`,
    emptyOutDir: true,
    rollupOptions: {
      input: { app: here(`${variant}/index.html`) }
    }
  }
})
