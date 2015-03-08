/**
 * TabMenuController
 *
 * @return TabMenuController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './controller'], function(extend, Controller) {
  /**
   * Constructor
   */
  function TabMenuController(view) {
    var model;
    TabMenuController.superconstructor.call(this, view);

    function followHash() {
      model.set(window.location.hash.replace(/^#/, ''));
    }

    model = this.model;

    // move to current location, if available
    followHash();

    $(window).on('hashchange', followHash);
  }
  extend(TabMenuController, Controller);

  return TabMenuController;
});
