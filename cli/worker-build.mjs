// Bundling entry point for per-target workers.
// Identical logic to worker.mjs but uses static imports so esbuild can resolve
// the 'options'/'presets'/'strings' aliases at build time via the variant-alias
// plugin. No registerHooks needed here.

import { workerData, parentPort } from 'worker_threads'
import StateModel from '../scripts/ui/statemodel.js'
import Listener from '../scripts/core/listener.js'
import commands from './commands.js'

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
