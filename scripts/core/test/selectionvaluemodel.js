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
    var SelectionValueModel, ListModel;

    SelectionValueModel = getModule('core/selectionvaluemodel');
    ListModel = getModule('core/listmodel');

    QUnit.test('SelectionValueModel', function() {
      var model, allowed, defaultvalue;

      defaultvalue = 123;

      allowed = new ListModel();

      model = new SelectionValueModel(defaultvalue, allowed);
      QUnit.equal(model.get(), defaultvalue, 'defaultvalue respected');

      QUnit.equal(model.set(321), false, 'unallowed value');
      QUnit.equal(model.set(5), false, 'unallowed value');
      QUnit.equal(model.set('asd'), false, 'unallowed value');
      QUnit.equal(model.get(), defaultvalue, 'empty allowed-list');

      allowed.push(5);
      QUnit.equal(model.set(5), true, 'allowed value');
      QUnit.equal(model.set(5), true, 'allowed value, again');
      QUnit.equal(model.get(), 5, 'setting allowed value');

      allowed.push(4);
      allowed.push(3);
      allowed.push(2);
      allowed.push(1);
      allowed.push(10);
      allowed.push(551);

      QUnit.equal(model.get(), 5, 'retaining value on allowedlist-extension');

      QUnit.equal(model.set(10), true, 'allowed value');
      QUnit.equal(model.get(), 10, 'changing allowed value');

      allowed.remove(allowed.indexOf(10));
      QUnit.equal(model.get(), defaultvalue, 'value reverts to defaultValue');

      model.setDefault(321);
      QUnit.equal(model.get(), 321, 'default value changed, was not allowed');
    });
  };
});
