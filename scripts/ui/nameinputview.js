/**
 * A text input bound to a name: what is typed is what the model
 * gets, the moment the field is left or Enter is pressed. No save
 * button — a name is not a form.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import View from '../core/view.js'
import Listener from '../core/listener.js'

class NameInputView extends View {
  /**
   * @param model
   *          the model carrying the name
   * @param $view
   *          the input element
   * @param accessors
   *          { get(model), set(model, value) }
   */
  constructor (model, $view, accessors) {
    super(model, $view)
    this.accessors = accessors
    this.$view.on('change', this.apply.bind(this))
    this.$view.on('keydown', function (event) {
      if (event.key === 'Enter') {
        $view.blur()
      }
    })
    this.update()
  }

  update () {
    // never fight the user for the field they are typing in
    if (!this.$view.is(':focus')) {
      this.$view.val(this.accessors.get(this.model) || '')
    }
  }

  apply () {
    this.accessors.set(this.model, this.$view.val().trim())
    this.model.emit('update')
  }

  onupdate () {
    this.update()
  }

  /**
   * The input belongs to the tab's markup, not to this view: the
   * next team types into the same field. Only the binding goes.
   */
  destroy () {
    this.$view.off('change keydown')
    Listener.prototype.destroy.call(this)
  }
}

export default NameInputView
