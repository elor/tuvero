/**
 * An abstract controller class
 *
 * @return Controller
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  /**
   * Controls a model, which is referenced by its view.
   *
   * Please provide additional functions for controlling and event callback,
   * e.g. after button presses
   *
   * @param view
   *          An associated instance of View
   */
  function Controller (view) {
    this.model = view.model
    this.view = view
  }

  Controller.prototype.destroy = function () {
  }

  return Controller
})
