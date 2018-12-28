/**
 * No Description
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/view', 'core/valuemodel', 'ui/checkboxcontroller'], //
  function (extend, View, ValueModel, CheckboxController) {
  /**
   * Constructor
   *
   * @param model
   *          a boolean ValueModel instance
   * @param $view
   *          the checkbox
   */
    function CheckBoxView (model, $view) {
      CheckBoxView.superconstructor.call(this, model || new ValueModel(), $view)

      if (this.model.get() !== true && this.model.get() !== false) {
        this.model.set(this.$view.prop('checked'))
      }

      this.controller = new CheckboxController(this)

      this.update()
    }
    extend(CheckBoxView, View)

    /**
   * apply model state to checkbox state
   */
    CheckBoxView.prototype.update = function () {
      var viewvalue, modelvalue

      viewvalue = this.$view.prop('checked')
      modelvalue = this.model.get()

      if (viewvalue !== modelvalue) {
        this.$view.prop('checked', modelvalue)
      }
    }

    /**
   * Callback function
   */
    CheckBoxView.prototype.onupdate = function () {
      this.update()
    }

    return CheckBoxView
  })
