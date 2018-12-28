/**
 * TabMenuController
 *
 * @return TabMenuController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/controller', 'core/listener'], function ($,
  extend, Controller, Listener) {
  /**
   * Constructor
   *
   * @param view
   *          the associated TabMenuView
   */
  function TabMenuController (view) {
    var model, listener

    TabMenuController.superconstructor.call(this, view)

    model = this.model

    function followHash () {
      model.set(window.location.hash.replace(/^#/, ''))
    }

    // move to current location, if available
    $(window).on('hashchange', followHash)

    // follow the hash if the tab accessibility has changed in our favor
    listener = new Listener(this.view.tabnames)
    listener.oninsert = followHash

    // follow the hash now
    followHash()
  }
  extend(TabMenuController, Controller)

  /**
   * focus a tab using the hard way: location change.
   *
   * @param tabname
   *          the tab to focus
   */
  TabMenuController.prototype.focus = function (tabname) {
    window.location.hash = '#' + tabname
  }

  return TabMenuController
})
