/**
 * InputValueController
 *
 * @return InputValueController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/controller'],
  function ($, extend, Controller) {
  /**
   * Constructor
   */
  function InputValueController(view) {
    var controller;
    InputValueController.superconstructor.call(this, view);

    controller = this;

    this.view.$view.change(function () {
      controller.model.set(Number(controller.view.$view.val()));
    });
  }
  extend(InputValueController, Controller);

  return InputValueController;
});
