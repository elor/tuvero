/**
 * TimeMachineModel
 *
 * TODO TEST!
 *
 * @return TimeMachineModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'ui/timemachinekeymodel',
    'ui/timemachinereflogmodel'], function(extend, Model, TimeMachineKeyModel,
    TimeMachineRefLog) {
  /**
   * Constructor
   */
  function TimeMachineModel() {
    this.activeKey = new TimeMachineRefLog.latest();

    TimeMachineModel.superconstructor.call(this);
  }
  extend(TimeMachineModel, Model);

  /**
   * stores the given state under a fresh key as the root of a new tree
   *
   * @param state
   *          the string to save
   * @return the generated key
   */
  TimeMachineModel.prototype.init = function(state) {
    var key = this.initKey();

    // TODO delete old states

    localStorage[key] = state;

    return key;
  };

  /**
   * stores te given state under a key, which is a descendant of parentKey
   *
   * @param state
   *          the string to save
   * @param parentKey
   *          the key of any parent in the same tree
   *
   * @return the generated key
   */
  TimeMachineModel.prototype.save = function(state, parentKey) {
    var key = this.generateKey(parentKey);

    // TODO delete old states

    localStorage[key] = state;

    return key;
  };

  return TimeMachineModel;
});
