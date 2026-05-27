import View from '../core/view.js'
import ValueModel from '../core/valuemodel.js'
import CheckboxController from './checkboxcontroller.js'

/**
 * Constructor
 *
 * @param model
 *          a boolean ValueModel instance
 * @param $view
 *          the checkbox
 */
class CheckBoxView extends View {
  constructor (model, $view) {
    super(model || new ValueModel(), $view)
    if (this.model.get() !== true && this.model.get() !== false) {
      this.model.set(this.$view.prop('checked'))
    }
    this.controller = new CheckboxController(this)
    this.update()
  }

  /**
  * apply model state to checkbox state
  */
  update () {
    const viewvalue = this.$view.prop('checked')
    const modelvalue = this.model.get()
    if (viewvalue !== modelvalue) {
      this.$view.prop('checked', modelvalue)
    }
  }

  /**
  * Callback function
  */
  onupdate () {
    this.update()
  }
}

export default CheckBoxView
