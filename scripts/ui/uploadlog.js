/**
 * UploadLog singleton bound to the browser's localStorage.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import UploadLogModel from '../core/uploadlog.js'

function browserStorage () {
  try {
    return window.localStorage
  } catch (error) {
    // Storage access can throw (disabled DOM storage); the model
    // falls back to in-memory.
    return undefined
  }
}

const UploadLog = new UploadLogModel(browserStorage())

export default UploadLog
