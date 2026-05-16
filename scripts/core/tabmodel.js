/**
 * TabModel: control the visibility and accesibility state of a tab
 *
 * @return TabModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import Model from './model.js';
import ValueModel from './valuemodel.js';
/**
 * Constructor
 */
function TabModel() {
  TabModel.superconstructor.call(this);
  this.visibility = new ValueModel(true);
  this.accessibility = new ValueModel(true);
  this.imgParam = new ValueModel('');
}
extend(TabModel, Model);
export default TabModel;