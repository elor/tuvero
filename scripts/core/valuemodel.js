import Model from './model.js'

/**
 * Constructor
 *
 * @param value
 *          the initial value
 */
class ValueModel extends Model {
  constructor (value) {
    super()
    if (this.onupdate !== ValueModel.prototype.onupdate && this.bind === ValueModel.prototype.bind) {
      this.bind = undefined
    }

    // don't call this.set, because set() can be overridden by a subclass
    ValueModel.prototype.set.call(this, value)
  }

  /**
   * set the value
   *
   * @param value
   *          the new value
   */
  set (value) {
    if (this.value !== value) {
      this.value = value
      this.emit('update', value)
    }
  }

  /**
   * retrieve the value
   *
   * @return the stored value
   */
  get () {
    return this.value
  }

  /**
   * bind this value to another value without re-registering the listeners. The
   * connection is one-way only, but two symmetric bind calls are supported.
   *
   * Does not work if onupdate() is overwritten to avoid undefined behaviour.
   * This function is intended to be used to catch state changes in static
   * structures, such as the image parameter in the tabs, which could be mapped
   * to the team size.
   *
   * @param valueModel
   *          the other value model
   */
  bind (valueModel) {
    valueModel.registerListener(this)
    this.onupdate(valueModel)
  }

  /**
   * Callback function
   *
   * TODO use 'value' event or something, not 'update', which is ambiguous
   *
   * @param emitter
   */
  onupdate (emitter) {
    if (this.set) {
      this.set(emitter.get())
    }
  }
}

/*
 * ValueModel does not implement save()/restore(), because it is an abstract
 * class which can store generic data types that is used primarily for
 * communicating value changes, not storing them efficiently.
 *
 * Please use a SuperModel instead, e.g. StateModel or PropertyModel.
 */
export default ValueModel
