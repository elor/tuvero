/**
 * PropertyValueModel
 *
 * @return PropertyValueModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
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
function PropertyValueModel(model, prop) {
  PropertyValueModel.superconstructor.call(this, model.getProperty(prop));
  this.prop = prop;
  model.registerListener(this);
  Listener.bind(this, 'update', function () {
    model.setProperty(prop, this.get());
  }, this);
}
extend(PropertyValueModel, ValueModel);
PropertyValueModel.prototype.onupdate = function (emitter, event, data) {
  if (data.key === this.prop) {
    this.set(data.value);
  }
};
export default PropertyValueModel;