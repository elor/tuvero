/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, PropertyValueModel, ValueModel, PropertyModel, Listener;

    extend = getModule('lib/extend');
    PropertyValueModel = getModule('core/propertyvaluemodel');
    PropertyModel = getModule('core/propertymodel');
    ValueModel = getModule('core/valuemodel');
    Listener = getModule('core/listener');

    QUnit.test('PropertyValueModel', function (assert) {
      var model, value, listener;

      assert.ok(extend.isSubclass(PropertyValueModel, ValueModel),
          'PropertyValueModel is subclass of ValueModel');

      model = new PropertyModel({
        bool: true,
        num: 5,
        str: 'dapfen'
      });

      value = new PropertyValueModel(model, 'bool');

      assert.ok(value, 'bool value initialization');
      assert.equal(value.get(), true, 'value is initialized to current value');

      listener = new Listener(value);
      listener.updates = 0;
      listener.onupdate = function() {
        this.updates += 1;
      };

      model.setProperty('bool', false);
      assert.equal(listener.updates, 1, 'value: 1 propagate update');
      assert.equal(value.get(), false, 'value is propagated to value');

      listener.updates = 0;
      value.set(true);
      assert.equal(listener.updates, 1, 'value.set(): no event loop');
      assert.equal(value.get(), true, 'value is properly set');
      assert.equal(model.getProperty('bool'), true,
          'value is propagated to PropertyModel');

      listener.updates = 0;
      value.set(value.get());
      assert.equal(listener.updates, 0, 'value.set(value.get()): no-op');

      listener.updates = 0;
      model.setProperty('bool', model.getProperty('bool'));
      assert.equal(listener.updates, 0, 'setProp(getProp()): no-op');
    });
  };
});
