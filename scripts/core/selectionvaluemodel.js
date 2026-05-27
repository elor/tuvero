import ValueModel from './valuemodel.js'

/**
 * Constructor
 *
 * @param defaultValue
 *          the default value, which also serves as the initial value
 * @param allowedValues
 *          a ListModel instance of allowed values
 */
class SelectionValueModel extends ValueModel {
  constructor (defaultValue, allowedValues) {
    super(defaultValue)
    this.allowedValues = allowedValues
    this.setDefault(defaultValue)
    this.allowedValues.registerListener(this)
  }

  /**
   * /** *
   *
   * @param value
   * @return true if the value would be valid, false otherwise
   */
  isValid (value) {
    return this.allowedValues.indexOf(value) !== -1
  }

  /**
   * set the value if it's valid, i.e. if it has been registered as a valid
   * option *
   *
   * @param value
   *          the value
   * @return true on success, false otherwise
   */
  set (value) {
    if (this.isValid(value)) {
      super.set(value)
      return true
    }
    return false
  }

  /**
   * set the default value, which supersedes the allowed values *
   *
   * @param defaultValue
   *          the default value
   */
  setDefault (defaultValue) {
    this.defaultValue = defaultValue
    this.validate()
  }

  /**
   * check whether the current value is still valid and set the default value
   * otherwise. Ignores the allowed values for the default value.
   */
  validate () {
    if (!this.isValid(this.get())) {
      super.set(this.defaultValue)
    }
  }

  /**
   * Event callback for removing a value from the underlying list
   */
  onremove () {
    this.validate()
  }
}

export default SelectionValueModel
