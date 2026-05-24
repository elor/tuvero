import ValueModel from './valuemodel.js';
import Listener from './listener.js';

/**
 * Constructor
 *
 * @param model
 *          a PropertyModel instance
 * @param prop
 *          the name of the property
 */
class PropertyValueModel extends ValueModel {
  constructor(model, prop) {
    super(model.getProperty(prop));
    this.prop = prop;
    model.registerListener(this);
    Listener.bind(this, 'update', function () {
      model.setProperty(prop, this.get());
    }, this);
  }

  onupdate(emitter, event, data) {
    if (data.key === this.prop) {
      this.set(data.value);
    }
  }
}

export default PropertyValueModel;