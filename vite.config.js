import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import { templateVars } from './templatevars.js'

const here = (...p) => resolve(fileURLToPath(new URL('.', import.meta.url)), ...p)

const variant = process.env.VITE_VARIANT
const validVariants = ['basic', 'boule', 'tac']
if (variant && !validVariants.includes(variant)) {
  throw new Error(`Unknown VITE_VARIANT="${variant}". Must be one of: ${validVariants.join(', ')}`)
}

const variantAliases = ['options', 'presets', 'strings']

// Resolves variant-specific aliases (options/presets/strings) to the correct
// variant by walking up the module graph to find which variant entry loaded
// the importing file. Falls back to VITE_VARIANT for single-variant builds.
let devServer
const variantAliasPlugin = {
  name: 'variant-alias',
  enforce: 'pre',
  configureServer (server) {
    devServer = server
  },
  resolveId (id, importer) {
    if (!variantAliases.includes(id) || !importer) return null

    // Direct hit: importer lives inside a variant directory
    for (const v of validVariants) {
      if (importer.includes(`/${v}/`)) return here(`${v}/scripts/${id}.js`)
    }

    // Shared scripts: walk the dev server's module graph to find the
    // originating variant entry point
    if (devServer) {
      const visited = new Set()
      const findVariant = (moduleId) => {
        if (!moduleId || visited.has(moduleId)) return null
        visited.add(moduleId)
        for (const v of validVariants) {
          if (moduleId.includes(`/${v}/`)) return v
        }
        const mod = devServer.moduleGraph.getModuleById(moduleId)
        if (!mod) return null
        for (const imp of mod.importers) {
          const found = findVariant(imp.id)
          if (found) return found
        }
        return null
      }
      const v = findVariant(importer)
      if (v) return here(`${v}/scripts/${id}.js`)
    }

    // Build mode: use the configured VITE_VARIANT
    if (variant) return here(`${variant}/scripts/${id}.js`)
    return null
  }
}

// Assembles each variant's index.html from the Nunjucks partials in templates/
// at request/build time, injecting per-variant values (teamtext, variant, ...).
// This replaces the retired Gulp template build and restores a single source of
// truth instead of three hand-maintained index.html copies.
const njkEnv = nunjucks.configure(here('templates'), { autoescape: false, noCache: true })

const detectVariant = (...candidates) => {
  for (const c of candidates) {
    for (const v of validVariants) {
      if (c && c.includes(`/${v}/`)) return v
    }
  }
  return variant || null
}

const nunjucksHtmlPlugin = {
  name: 'nunjucks-html',
  transformIndexHtml: {
    order: 'pre',
    handler (html, ctx) {
      const v = detectVariant(ctx.filename, ctx.path)
      if (!v) return html
      return njkEnv.renderString(html, templateVars(v))
    }
  }
}

export default defineConfig({
  plugins: [variantAliasPlugin, nunjucksHtmlPlugin],
  build: variant
    ? {
        outDir: `build/${variant}`,
        emptyOutDir: true,
        rollupOptions: {
          input: { app: here(`${variant}/index.html`) }
        }
      }
    : {}
})
