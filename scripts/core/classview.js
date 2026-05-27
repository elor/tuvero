import View from './view.js'

/**
 * Constructor
 *
 * @param model
 *          a boolean ValueModel instance
 * @param $view
 *          the DOM element for which to change the classes
 * @param onclass
 *          Optional. the class when model.get() returns true
 * @param offclass
 *          Optional. the class when model.get() returns false
 */
class ClassView extends View {
  constructor (model, $view, onclass, offclass) {
    super(model, $view)
    this.onclass = onclass || undefined
    this.offclass = offclass || undefined
    this.update()
  }

  /**
   * set or remove the classes according to model.get()
   */
  update () {
    if (this.model.get()) {
      if (this.onclass) {
        this.$view.addClass(this.onclass)
      }
      if (this.offclass) {
        this.$view.removeClass(this.offclass)
      }
    } else {
      if (this.onclass) {
        this.$view.removeClass(this.onclass)
      }
      if (this.offclass) {
        this.$view.addClass(this.offclass)
      }
    }
  }

  /**
   * Callback function to monitor value changes
   */
  onupdate () {
    this.update()
  }
}

export default ClassView
