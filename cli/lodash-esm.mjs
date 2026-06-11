// ESM wrapper for the CJS lodash package.
// Uses a relative path so the 'lodash' hook in worker.mjs does not
// re-intercept this import and create a cycle.
import _ from '../node_modules/lodash/lodash.js'
export const range = _.range
export const zipObject = _.zipObject
export const uniq = _.uniq
export default _
