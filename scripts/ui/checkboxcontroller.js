/**
 * No Description
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import Controller from '../core/controller.js';

/**
 * Constructor
 *
 * @param view
 *          a CheckboxView instance
 */
class CheckboxController extends Controller {
  constructor(view) {
    let model, $checkbox, $parent;
    super(view);
    model = this.model;
    $checkbox = this.view.$view;
    $parent = $checkbox.parent().filter('span');
    $parent.click(function (e) {
      if ($(e.target).prop('tagName') === 'SPAN') {
        $checkbox.click();
      }
    });

    /**
     * apply checkbox state to model state
     */
    $checkbox.change(function () {
      let viewvalue, modelvalue;
      viewvalue = $checkbox.prop('checked');
      modelvalue = model.get();
      if (viewvalue !== modelvalue) {
        model.set(viewvalue);
      }
    });
  }
}

export default CheckboxController;