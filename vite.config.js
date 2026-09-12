import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { readFileSync } from 'node:fs'
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
//
// activeVariant tracks the variant of the most recent browser request. In dev
// mode each module is fetched individually, so the middleware fires before
// every resolveId call in that module's import chain. When the module graph
// contains importers from multiple variants (e.g. after a cross-variant
// redirect), activeVariant breaks the tie in favour of the current variant.
//
// On variant switch, only the shared modules that directly import a variant
// alias are soft-invalidated (no HMR events, just mark stale for next fetch).
// This is fast and targeted — typically 3–5 files (statemodel, matchresult…).
let devServer
let activeVariant = variant || null
const aliasImporters = new Set() // shared modules that import a variant alias
const variantAliasPlugin = {
  name: 'variant-alias',
  enforce: 'pre',
  configureServer (server) {
    devServer = server
    server.middlewares.use((req, _res, next) => {
      const m = req.url && req.url.match(/^\/(basic|boule|tac)\//)
      if (m && m[1] !== activeVariant) {
        activeVariant = m[1]
        // Hard-invalidate alias-importing shared modules (isHmr=false avoids
        // flooding the browser with HMR events; hard rather than soft so that
        // Vite re-runs resolveId on the next fetch and picks the new variant).
        for (const id of aliasImporters) {
          const mod = server.moduleGraph.getModuleById(id)
          if (mod) server.moduleGraph.invalidateModule(mod, new Set(), Date.now(), false)
        }
      }
      next()
    })
  },
  resolveId (id, importer) {
    if (!variantAliases.includes(id) || !importer) return null

    // Direct hit: importer lives inside a variant directory
    for (const v of validVariants) {
      if (importer.includes(`/${v}/`)) {
        activeVariant = v
        return here(`${v}/scripts/${id}.js`)
      }
    }

    // Track which shared modules import aliases so we know what to invalidate
    aliasImporters.add(importer)

    // activeVariant is set by the middleware for every browser request before
    // any resolveId calls in that module's fetch chain, so it is always correct
    // for the current variant — even when tac has never been loaded before and
    // its entry point is not yet in the module graph.
    if (activeVariant) return here(`${activeVariant}/scripts/${id}.js`)

    // Fallback for edge cases where the middleware hasn't run yet: walk the
    // module graph to find the originating variant entry point.
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

// Emits a per-variant web app manifest plus fixed-name icons, so each
// variant is installable as its own app ("Tuvero Boule" etc.) while
// sharing tuvero.de's root-scope service worker. Fixed fileName on
// purpose: the manifest URL must be stable across builds.
const webManifestPlugin = {
  name: 'web-manifest',
  apply: 'build',
  generateBundle () {
    if (!variant) return
    const vars = templateVars(variant)
    this.emitFile({
      type: 'asset',
      fileName: 'manifest.webmanifest',
      source: JSON.stringify({
        name: `Tuvero ${vars.variant}`,
        short_name: vars.variant,
        description: `Turnierleitung mit Tuvero ${vars.variant} — funktioniert auch offline.`,
        lang: 'de-DE',
        start_url: `/${variant}/`,
        scope: `/${variant}/`,
        display: 'standalone',
        background_color: '#f5f5f5',
        theme_color: '#f5f5f5',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }, null, 2)
    })
    for (const size of [192, 512]) {
      this.emitFile({
        type: 'asset',
        fileName: `icon-${size}.png`,
        source: readFileSync(here(`${variant}/images/icon-${size}.png`))
      })
    }
  }
}

export default defineConfig({
  root: variant ? here(variant) : undefined,
  plugins: [variantAliasPlugin, nunjucksHtmlPlugin, webManifestPlugin, viteSingleFile()],
  build: variant
    ? {
        assetsInlineLimit: Infinity,
        outDir: here(`dist/${variant}`),
        emptyOutDir: true,
      }
    : {}
})
