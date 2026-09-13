/**
 * Side-effect import for jsdom tests: this vitest setup ships no
 * window.localStorage (same situation as timemachine's query test),
 * but Storage/TimeMachine/UploadLog read it — some at import time.
 * Import this module FIRST, before anything that touches storage.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
if (typeof window !== 'undefined' && !window.localStorage) {
  window.localStorage = {
    getItem (key) {
      return Object.prototype.hasOwnProperty.call(this, key)
        ? this[key]
        : null
    },
    setItem (key, value) { this[key] = String(value) },
    removeItem (key) { delete this[key] }
  }
}
