import View from '../core/view.js'

/**
 * Constructor
 *
 * @param model
 *          a ListModel instance
 * @param $view
 *          the associated DOM element
 */
class LengthView extends View {
  constructor (model, $view, offset) {
    super(model, $view)
    this.offset = offset || 0
    this.update()
  }

  /**
   * write the playernames and teamnumber to the DOM
   */
  update () {
    this.$view.text(this.model.length + this.offset)
  }

  /**
   * Callback listener
   */
  onresize () {
    this.update()
  }
}

export default LengthView
