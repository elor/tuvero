/**
 * A InputValueView, which updates the value of ValueModel to the DOM
 *
 * @return InputValueView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/view', 'ui/inputvaluecontroller'],
  function (extend, View, InputValueController) {
  /**
   * Constructor
   *
   * @param model
   *          a ValueModel instance, which implements get() and emits update
   * @param $view
   *          the associated DOM element
   */
    function InputValueView (model, $view) {
      InputValueView.superconstructor.call(this, model, $view)

      this.update()

      this.controller = new InputValueController(this)
    }
    extend(InputValueView, View)

    /**
   * write the contents of get() to the DOM
   */
    InputValueView.prototype.update = function () {
      this.$view.val(this.model.get())
    }

    /**
   * Callback listener
   */
    InputValueView.prototype.onupdate = function () {
      this.update()
    }

    return InputValueView
  })
