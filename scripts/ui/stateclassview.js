import View from '../core/view.js'

/**
 * Constructor
 *
 * @param model
 *          a ValueModel instance, preferably a StateModel
 * @param $view
 */
class StateClassView extends View {
  constructor (model, $view) {
    super(model, $view)
    this.currentClass = undefined
    this.update()
  }

  /**
   * change the class to the value of this.model.get()
   */
  update () {
    const newClass = this.model.get()
    if (newClass !== this.currentClass) {
      this.$view.removeClass(this.currentClass)
      this.$view.addClass(newClass)
      this.currentClass = newClass
    }
  }

  /**
   * Callback function to monitor value changes
   */
  onupdate () {
    this.update()
  }
}

export default StateClassView
