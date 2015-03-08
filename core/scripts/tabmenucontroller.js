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
    TabMenuController.superconstructor.call(this, view);
  }
  extend(TabMenuController, Controller);

  return TabMenuController;
});
