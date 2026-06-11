import { workerData, parentPort } from 'worker_threads'
import { registerHooks } from 'module'
import { resolve as resolvePath } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const rootDir = resolvePath(fileURLToPath(import.meta.url), '../..')
const { target } = workerData

registerHooks({
  resolve (specifier, context, nextResolve) {
    if (['options', 'presets', 'strings'].includes(specifier)) {
      return { url: pathToFileURL(resolvePath(rootDir, target, 'scripts', specifier + '.js')).href, shortCircuit: true }
    }
    // lodash is CJS-only; redirect to the ESM wrapper so named imports work.
    if (specifier === 'lodash') {
      return { url: pathToFileURL(resolvePath(rootDir, 'cli/lodash-esm.mjs')).href, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  }
})

const { default: StateModel } = await import('../scripts/ui/statemodel.js')
const { default: Listener } = await import('../scripts/core/listener.js')
const { default: commands } = await import('./commands.js')

const state = new StateModel()
let errorMsg = null
Listener.bind(state, 'error', (_emitter, _event, data) => { errorMsg = data })

if (!state.restore(workerData.savedState)) {
  parentPort.postMessage({ error: errorMsg || 'cannot restore saved state' })
} else {
  try {
    parentPort.postMessage({ result: commands[workerData.command](state) })
  } catch (e) {
    parentPort.postMessage({ error: e.message || String(e) })
  }
}
