/**
 * SelectionValueModel:
 *
 * @return SelectionValueModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/valuemodel'], function(extend, ValueModel) {
  /**
   * Constructor
   *
   * @param defaultValue
   *          the default value, which also serves as the initial value
   * @param allowedValues
   *          a ListModel instance of allowed values
   */
  function SelectionValueModel(defaultValue, allowedValues) {
    SelectionValueModel.superconstructor.call(this, defaultValue);

    this.allowedValues = allowedValues;
    this.setDefault(defaultValue);

    this.allowedValues.registerListener(this);
  }
  extend(SelectionValueModel, ValueModel);

  /**
   * /** *
   *
   * @param value
   * @return true if the value would be valid, false otherwise
   */
  SelectionValueModel.prototype.isValid = function(value) {
    return this.allowedValues.indexOf(value) !== -1;
  };

  /**
   * set the value if it's valid, i.e. if it has been registered as a valid
   * option *
   *
   * @param value
   *          the value
   * @return true on success, false otherwise
   */
  SelectionValueModel.prototype.set = function(value) {
    if (this.isValid(value)) {
      SelectionValueModel.superclass.set.call(this, value);
      return true;
    }
    return false;
  };

  /**
   * set the default value, which supersedes the allowed values *
   *
   * @param defaultValue
   *          the default value
   */
  SelectionValueModel.prototype.setDefault = function(defaultValue) {
    this.defaultValue = defaultValue;
    this.validate();
  };

  /**
   * check whether the current value is still valid and set the default value
   * otherwise. Ignores the allowed values for the default value.
   */
  SelectionValueModel.prototype.validate = function() {
    if (!this.isValid(this.get())) {
      SelectionValueModel.superclass.set.call(this, this.defaultValue);
    }
  };

  /**
   * Event callback for removing a value from the underlying list
   */
  SelectionValueModel.prototype.onremove = function() {
    this.validate();
  };

  return SelectionValueModel;
});
