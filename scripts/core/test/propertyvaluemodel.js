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
    var extend, PropertyValueModel, ValueModel;

    extend = getModule('lib/extend');
    PropertyValueModel = getModule('core/propertyvaluemodel');
    PropertyModel = getModule('core/propertymodel');
    ValueModel = getModule('core/valuemodel');
    Listener = getModule('core/listener');

    QUnit.test('PropertyValueModel', function() {
      var model, value, listener;

      QUnit.ok(extend.isSubclass(PropertyValueModel, ValueModel),
          'PropertyValueModel is subclass of ValueModel');

      model = new PropertyModel({
        bool: true,
        num: 5,
        str: 'dapfen'
      });

      value = new PropertyValueModel(model, 'bool');

      QUnit.ok(value, 'bool value initialization');
      QUnit.equal(value.get(), true, 'value is initialized to current value');

      listener = new Listener(value);
      listener.updates = 0;
      listener.onupdate = function() {
        this.updates += 1;
      };

      model.setProperty('bool', false);
      QUnit.equal(listener.updates, 1, 'value: 1 propagate update');
      QUnit.equal(value.get(), false, 'value is propagated to value');

      listener.updates = 0;
      value.set(true);
      QUnit.equal(listener.updates, 1, 'value.set(): no event loop');
      QUnit.equal(value.get(), true, 'value is properly set');
      QUnit.equal(model.getProperty('bool'), true,
          'value is propagated to PropertyModel');

      listener.updates = 0;
      value.set(value.get());
      QUnit.equal(listener.updates, 0, 'value.set(value.get()): no-op');

      listener.updates = 0;
      model.setProperty('bool', model.getProperty('bool'));
      QUnit.equal(listener.updates, 0, 'setProp(getProp()): no-op');
    });
  };
});
