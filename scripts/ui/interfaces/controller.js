/**
 * An abstract controller class
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 * @returns Controller
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
    this.model = view.model;
    this.view = view;
  }

  return Controller;
});
