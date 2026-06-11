#!/usr/bin/env node
// Bundles the CLI server into dist/cli/ — server.mjs + one worker per variant.
// No node_modules needed at runtime; copy the four files anywhere and run
// `node server.mjs`.

import { build } from 'esbuild'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdir } from 'fs/promises'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'dist/cli')
const targets = ['tac', 'basic', 'boule']

await mkdir(outDir, { recursive: true })

const sharedConfig = {
  bundle: true,
  platform: 'node',
  format: 'esm',
  // Externalize all Node built-ins (both bare and node: prefixed forms).
  external: ['node:*'],
  // Point lodash straight at its CJS bundle so esbuild handles CJS→ESM interop
  // instead of going through our Node-only createRequire shim.
  alias: { lodash: resolve(root, 'node_modules/lodash/lodash.js') }
}

// Build one worker per variant with aliases resolved at build time.
for (const target of targets) {
  await build({
    ...sharedConfig,
    entryPoints: [resolve(root, 'cli/worker-build.mjs')],
    outfile: resolve(outDir, `worker-${target}.mjs`),
    plugins: [{
      name: 'variant-alias',
      setup (b) {
        b.onResolve({ filter: /^(options|presets|strings)$/ }, (args) => ({
          path: resolve(root, target, 'scripts', `${args.path}.js`)
        }))
      }
    }]
  })
  console.log(`built worker-${target}.mjs`)
}

// Build the server, bundling express and everything else.
// The banner defines `require` so that CJS packages (express, etc.) can resolve
// Node built-ins at runtime — esbuild's __require wrapper uses it when present.
await build({
  ...sharedConfig,
  entryPoints: [resolve(root, 'cli/bin/tuvero-server.js')],
  outfile: resolve(outDir, 'server.mjs'),
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`
  }
})
console.log('built server.mjs')
console.log(`\nDone → dist/cli/  (run with: node dist/cli/server.mjs)`)
