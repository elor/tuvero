/**
 * dummy model which serves as a simple event emitter for views which don't
 * require additional logic, e.g. BoxView
 * 
 * @exports DummyModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/model' ], function (extend, Model) {
  /**
   * Constructor
   */
  function DummyModel () {
    DummyModel.superconstructor.call(this);
  }
  extend(DummyModel, Model);

  return DummyModel;
});
