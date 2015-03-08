/**
 * TabModel: control the visibility and accesibility state of a tab
 *
 * @return TabModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './model', './valuemodel'], function(extend, Model,
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
