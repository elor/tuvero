/**
 * TabModel: control the visibility and accesibility state of a tab
 *
 * @return TabModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/valuemodel'], function(extend, Model,
    ValueModel) {
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

  return TabModel;
});
