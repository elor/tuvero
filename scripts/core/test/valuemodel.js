/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var ValueModel;

    ValueModel = getModule('core/valuemodel');

    QUnit.test('ValueModel', function(assert) {
      var model, listener, obj, model2;

      listener = {
        lastdata: undefined,
        updatecount: 0,
        onupdate: function(emitter, event, data) {
          listener.updatecount += 1;
          listener.lastdata = data;
        },
        emitters: []
      };

      model = new ValueModel();
      assert.equal(model.get(), undefined, 'default value: undefined');

      model = new ValueModel(5);
      assert.equal(model.get(), 5, 'accepting numeric default values');

      model = new ValueModel(0);
      assert.equal(model.get(), 0, 'accepting 0 as a default value');

      model.registerListener(listener);
      model.set(12345);
      assert.equal(model.get(), 12345, 'set() sets a new value');
      assert.equal(listener.updatecount, 1, 'set() fires an update event');

      model.set(12345);
      assert.equal(model.get(), 12345, 'set() retains the old value');
      assert.equal(listener.updatecount, 1,
          'set() does not update if values match');

      model.set('12345');
      assert.equal(model.get(), '12345', 'set() updates on type mismatch');
      assert.equal(listener.updatecount, 2, 'set() type mismatch: fire update');

      obj = {};
      model.set(obj);
      assert.equal(model.get(), obj, 'set(): objects are referenced directly');

      model2 = new ValueModel();
      model = new ValueModel();
      model.bind(model2);

      model2.set(5);
      assert.equal(model.get(), 5, 'bind(): works with numbers');

      obj = {};
      model2.set(obj);
      assert.equal(model.get(), obj, 'bind(): works with object references');

      model2.bind(model);
      model.set(11);
      assert.equal(model.get(), 11, 'cyclic bind(): model A');
      assert.equal(model2.get(), 11, 'cyclic bind(): model B');
    });
  };
});
