/**
 * Model class tests
 *
 * @return Model
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  return function(QUnit, getModule) {
    var Model, Emitter, extend;

    Model = getModule('ui/model');
    Emitter = getModule('ui/emitter');
    extend = getModule('lib/extend');

    QUnit.test('Model', function() {
      QUnit.ok(extend.isSubclass(Model, Emitter), 'Model is an Emitter subclass');
    });
  };
});
