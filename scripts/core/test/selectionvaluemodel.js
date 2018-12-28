/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var SelectionValueModel, ListModel

    SelectionValueModel = getModule('core/selectionvaluemodel')
    ListModel = getModule('list/listmodel')

    QUnit.test('SelectionValueModel', function (assert) {
      var model, allowed, defaultvalue

      defaultvalue = 123

      allowed = new ListModel()

      model = new SelectionValueModel(defaultvalue, allowed)
      assert.equal(model.get(), defaultvalue, 'defaultvalue respected')

      assert.equal(model.set(321), false, 'unallowed value')
      assert.equal(model.set(5), false, 'unallowed value')
      assert.equal(model.set('asd'), false, 'unallowed value')
      assert.equal(model.get(), defaultvalue, 'empty allowed-list')

      allowed.push(5)
      assert.equal(model.set(5), true, 'allowed value')
      assert.equal(model.set(5), true, 'allowed value, again')
      assert.equal(model.get(), 5, 'setting allowed value')

      allowed.push(4)
      allowed.push(3)
      allowed.push(2)
      allowed.push(1)
      allowed.push(10)
      allowed.push(551)

      assert.equal(model.get(), 5, 'retaining value on allowedlist-extension')

      assert.equal(model.set(10), true, 'allowed value')
      assert.equal(model.get(), 10, 'changing allowed value')

      allowed.remove(allowed.indexOf(10))
      assert.equal(model.get(), defaultvalue, 'value reverts to defaultValue')

      model.setDefault(321)
      assert.equal(model.get(), 321, 'default value changed, was not allowed')
    })
  }
})
