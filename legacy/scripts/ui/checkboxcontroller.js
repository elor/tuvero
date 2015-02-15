/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/controller'], function(extend, Controller) {
  /**
   * Constructor
   *
   * @param view
   *          a CheckboxView instance
   */
  function CheckboxController(view) {
    var model, $checkbox;
    CheckboxController.superconstructor.call(this, view);

    model = this.model;
    $checkbox = this.view.$view;

    /**
     * apply checkbox state to model state
     */
    $checkbox.change(function() {
      var viewvalue, modelvalue;

      viewvalue = $checkbox.prop('checked');
      modelvalue = model.get();

      if (viewvalue !== modelvalue) {
        model.set(viewvalue);
      }
    });
  }
  extend(CheckboxController, Controller);

  return CheckboxController;
});
