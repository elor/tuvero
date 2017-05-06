/**
 * Model class tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var Model, Emitter, extend;

    Model = getModule('core/model');
    Emitter = getModule('core/emitter');
    extend = getModule('lib/extend');

    QUnit.test('Model', function() {
      var model, success;

      QUnit.ok(extend.isSubclass(Model, Emitter),
          'Model is an Emitter subclass');

      model = new Model();

      QUnit.deepEqual(model.save(), {}, 'Model.save() returns empty object');

      try {
        QUnit.equal(model.restore({}), true,
            'Model.restore() returns true on success');
        success = true;
      } catch (e) {
        success = false;
      }
      QUnit.ok(success, 'model.restore() exists and is a function');

    });
  };
});
