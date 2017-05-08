/**
 * PropertyValueModel
 *
 * @return PropertyValueModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/valuemodel', 'core/listener'], function(extend,
    ValueModel, Listener) {
  /**
   * Constructor
   *
   * @param model
   *          a PropertyModel instance
   * @param prop
   *          the name of the property
   */
  function PropertyValueModel(model, prop) {
    PropertyValueModel.superconstructor.call(this, model.getProperty(prop));

    this.prop = prop;

    model.registerListener(this);

    Listener.bind(this, 'update', function() {
      model.setProperty(prop, this.get());
    }, this);
  }
  extend(PropertyValueModel, ValueModel);

  PropertyValueModel.prototype.onupdate = function(emitter, event, data) {
    if (data.key === this.prop) {
      this.set(data.value);
    }
  };

  return PropertyValueModel;
});
