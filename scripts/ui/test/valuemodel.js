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

    ValueModel = getModule('ui/valuemodel');

    QUnit.test('ValueModel', function() {
      var model, listener, obj;

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
      QUnit.equal(model.get(), undefined, 'default value: undefined');

      model = new ValueModel(5);
      QUnit.equal(model.get(), 5, 'accepting numeric default values');

      model = new ValueModel(0);
      QUnit.equal(model.get(), 0, 'accepting 0 as a default value');

      model.registerListener(listener);
      model.set(12345);
      QUnit.equal(model.get(), 12345, 'set() sets a new value');
      QUnit.equal(listener.updatecount, 1, 'set() fires an update event');

      model.set(12345);
      QUnit.equal(model.get(), 12345, 'set() retains the old value');
      QUnit.equal(listener.updatecount, 1,
          'set() does not update if values match');

      model.set('12345');
      QUnit.equal(model.get(), "12345", 'set() updates on type mismatch');
      QUnit.equal(listener.updatecount, 2, 'set() type mismatch: fire update');

      obj = {};
      model.set(obj);
      QUnit.equal(model.get(), obj, 'set(): objects are referenced directly');
    });
  };
});
