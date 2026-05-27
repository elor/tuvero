/**
 * LegacyStorageKeyConverter: Convert old savestate keys from the localStorage
 * to the new TimeMachine/KeyModel keys
 *
 * @return LegacyStorageKeyConverter
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import CommitModel from '../timemachine/commitmodel.js'
import Presets from 'presets'
const keyRegex = new RegExp('^' + Presets.target + 's?tournament$')

/**
 * Constructor. Does nothing.
 */
class LegacyStorageKeyConverter {
  /**
   * Find all legacy keys in the local storage for the current target and
   * convert them.
   */
  convertAll () {
    let allKeys
    if (window.localStorage) {
      allKeys = Object.keys(window.localStorage)
    } else {
      allKeys = []
    }
    const legacyKeys = allKeys.filter(keyRegex.test.bind(keyRegex))
    legacyKeys.forEach(this.convert.bind(this))
  }

  /**
   * move a single legacy key to the reflog if it is in the local storage and
   * contains data. No tests are performed for the fitness of the data itself.
   *
   * @param legacyKey
   *          e.g. 'boulestournament' or 'tactournament'
   * @return true on success, false otherwise
   */
  convert (legacyKey) {
    if (!legacyKey) {
      return true
    }
    if (!window.localStorage) {
      return false
    }
    const storedString = window.localStorage[legacyKey]
    if (!storedString) {
      window.localStorage.removeItem(legacyKey)
      return true
    }
    const commit = CommitModel.createRoot(storedString, 'imported_' + legacyKey)
    if (commit && commit.isValid()) {
      window.localStorage.removeItem(legacyKey)
      return true
    }
    return false
  }
}

export default LegacyStorageKeyConverter
