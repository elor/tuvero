/**
 * BrowserInfoController
 *
 * @return BrowserInfoController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
/**
 * Constructor
 */
function BrowserInfoController(view) {
  let model;
  BrowserInfoController.superconstructor.call(this, view);
  this.$updateButton = this.view.$view.find('button.update');
  model = this.model;
  this.$updateButton.click(function () {
    model.emit('update');
  });
}
extend(BrowserInfoController, Controller);
export default BrowserInfoController;