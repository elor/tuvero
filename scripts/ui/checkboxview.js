/**
 * No Description
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import View from '../core/view.js';
import ValueModel from '../core/valuemodel.js';
import CheckboxController from './checkboxcontroller.js';
/**
 * Constructor
 *
 * @param model
 *          a boolean ValueModel instance
 * @param $view
 *          the checkbox
 */
function CheckBoxView(model, $view) {
  CheckBoxView.superconstructor.call(this, model || new ValueModel(), $view);
  if (this.model.get() !== true && this.model.get() !== false) {
    this.model.set(this.$view.prop('checked'));
  }
  this.controller = new CheckboxController(this);
  this.update();
}
extend(CheckBoxView, View);

/**
* apply model state to checkbox state
*/
CheckBoxView.prototype.update = function () {
  var viewvalue, modelvalue;
  viewvalue = this.$view.prop('checked');
  modelvalue = this.model.get();
  if (viewvalue !== modelvalue) {
    this.$view.prop('checked', modelvalue);
  }
};

/**
* Callback function
*/
CheckBoxView.prototype.onupdate = function () {
  this.update();
};
export default CheckBoxView;