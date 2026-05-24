import Model from './model.js';
import ValueModel from './valuemodel.js';

/**
 * Constructor
 */
class TabModel extends Model {
  constructor() {
    super();
    this.visibility = new ValueModel(true);
    this.accessibility = new ValueModel(true);
    this.imgParam = new ValueModel('');
  }
}

export default TabModel;