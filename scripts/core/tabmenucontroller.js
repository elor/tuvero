/**
 * TabMenuController
 *
 * @return TabMenuController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Controller from './controller.js'
import Listener from './listener.js'

/**
 * Constructor
 *
 * @param view
 *          the associated TabMenuView
 */
class TabMenuController extends Controller {
  constructor (view) {
    super(view)
    const model = this.model
    function followHash () {
      model.set(window.location.hash.replace(/^#/, ''))
    }

    // move to current location, if available
    $(window).on('hashchange', followHash)

    // follow the hash if the tab accessibility has changed in our favor
    const listener = new Listener(this.view.tabnames)
    listener.oninsert = followHash

    // follow the hash now
    followHash()
  }

  /**
   * focus a tab using the hard way: location change.
   *
   * @param tabname
   *          the tab to focus
   */
  focus (tabname) {
    window.location.hash = '#' + tabname
  }
}

export default TabMenuController
