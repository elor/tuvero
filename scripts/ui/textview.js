import View from '../core/view.js'

/**
 * constructor
 *
 * @param text
 *          the initial text
 * @param $view
 *          the containing DOM element
 */
class TextView extends View {
  constructor (text, $view) {
    super(undefined, $view)
    this.setText(text)
  }

  /**
   * change the text of this element
   *
   * @param text
   *          the new text
   */
  setText (text) {
    if (text === undefined) {
      this.model.text = 'undefined'
    } else {
      this.model.text = text
    }
    this.model.emit('update')
  }

  /**
   * reset the text to an empty string
   */
  reset () {
    this.setText('')
  }

  /**
   * write the current text to the DOM element
   */
  update () {
    this.$view.text(this.model.text)
  }

  /**
   * Callback listener
   */
  onupdate () {
    this.update()
  }
}

export default TextView
