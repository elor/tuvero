/**
 * Supports Online(), which returns true if the browser is online.
 *
 * The old offline-exit nag ("you cannot re-open this page") left with
 * AppCache: the app is precached by tuvero.de's root-scope service
 * worker now, so an offline visitor can always re-open it.
 *
 * @return Online
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

/**
 * Check for an internet connection. Does not check for an active connection
 * to tuvero.de
 *
 * @return true if there's an active internet connection, false otherwise.
 */
const Online = function () {
  return navigator.onLine
}

export default Online
