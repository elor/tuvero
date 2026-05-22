/**
 * InputValueController
 *
 * @return InputValueController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
/**
 * Constructor
 */
function InputValueController(view) {
  let controller;
  InputValueController.superconstructor.call(this, view);
  controller = this;
  this.view.$view.change(function () {
    controller.model.set(Number(controller.view.$view.val()));
  });
}
extend(InputValueController, Controller);
export default InputValueController;