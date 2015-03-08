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

      model.set(321);
      model.set(5);
      model.set('asd');
      QUnit.equal(model.get(), defaultvalue, 'empty allowed-list');

      allowed.push(5);
      model.set(5);
      QUnit.equal(model.get(), 5, 'setting allowed value');

      allowed.push(4);
      allowed.push(3);
      allowed.push(2);
      allowed.push(1);
      allowed.push(10);
      allowed.push(551);

      QUnit.equal(model.get(), 5, 'retaining value on allowedlist-extension');

      model.set(10);
      QUnit.equal(model.get(), 10, 'changing allowed value');

      allowed.remove(allowed.indexOf(10));
      QUnit.equal(model.get(), defaultvalue, 'value not allowed anymore');

      model.setDefault(321);
      QUnit.equal(model.get(), 321, 'default value changed, was not allowed');
    });
  };
});
