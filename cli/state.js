import { Worker } from 'worker_threads'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'
import commands from './commands.js'

// Cache per-target worker URLs after the first lookup.
const workerURLCache = {}
function workerURL (target) {
  if (!workerURLCache[target]) {
    const bundled = new URL(`./worker-${target}.mjs`, import.meta.url)
    workerURLCache[target] = existsSync(fileURLToPath(bundled))
      ? bundled
      : new URL('./worker.mjs', import.meta.url)
  }
  return workerURLCache[target]
}

function run (savedState, command) {
  return new Promise((resolve, reject) => {
    if (typeof savedState === 'string') {
      try {
        savedState = JSON.parse(savedState)
      } catch (e) {
        return reject(new Error('Invalid JSON: ' + e.message))
      }
    }
    if (typeof savedState !== 'object' || !savedState) {
      return reject(new Error('incompatible data type. Must be JSON string or JSON object'))
    }
    if (!savedState.target) {
      return reject(new Error('No Tuvero target given. Is this even a Tuvero savestate?'))
    }
    if (!commands[command]) {
      return reject(new Error('Command not recognized. Available commands: ' + Object.keys(commands).join(', ')))
    }

    const worker = new Worker(workerURL(savedState.target), { workerData: { target: savedState.target, savedState, command } })
    worker.once('message', ({ result, error }) => {
      if (error) reject(new Error(error))
      else resolve(result)
    })
    worker.once('error', reject)
  })
}

async function load (file, command) {
  const contents = await readFile(file, 'utf-8')
  return run(contents, command)
}

export { run, load, commands }
