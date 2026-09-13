/**
 * Dev builds auto-reload when a new deploy's service worker takes
 * over (see templates/head.html). The reload itself is silent — this
 * shows the confirmation afterwards, so an open staging/dev tab
 * visibly announces "you are now on the new build".
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import Debug from '../ui/debug.js'
import Toast from '../ui/toast.js'

if (Debug.isDevVersion) {
  try {
    if (window.sessionStorage.getItem('tuvero-dev-reload')) {
      window.sessionStorage.removeItem('tuvero-dev-reload')
      Toast.once('Auf neue Version aktualisiert', Toast.LONG)
    }
  } catch (ignored) {
    // no sessionStorage: nothing to announce
  }
}

export default undefined
