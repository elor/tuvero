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
    var PropertyModel;

    PropertyModel = getModule('core/propertymodel');

    QUnit.test('PropertyModel', function() {
      var prop, listener, ref;

      prop = new PropertyModel();
      QUnit.ok(prop !== undefined, 'empty initialization is allowed');
      QUnit.equal(prop.getProperty('someprop'), undefined,
          'access to undefined keys returns undefined');

      listener = {
        success: false,
        onupdate: function() {
          this.success = true;
        },
        emitters: []
      };

      prop.registerListener(listener);

      QUnit.equal(prop.setProperty('name', 'Some Name'), true,
          'setProperty() returns true');
      QUnit.equal(listener.success, true, 'setProperty() emits update event');
      QUnit.equal(prop.getProperty('name'), 'Some Name',
          'setProperty() actually stores values');

      listener.success = false;
      QUnit.equal(prop.setProperty('name', 'Another Name'), true,
          'setProperty() returns true');
      QUnit.equal(listener.success, true, 'setProperty() emits update event');
      QUnit.equal(prop.getProperty('name'), 'Another Name',
          'setProperty() actually changes values');

      listener.success = false;
      QUnit.equal(prop.setProperty('name', 'Another Name'), false,
          'setProperty() returns false on no-change');
      QUnit.equal(listener.success, false,
          'setProperty() emits no update on no-change');
      QUnit.equal(prop.getProperty('name'), 'Another Name',
          'setProperty() did not change any values');

      ref = {
        asd: 'dsa',
        i: 5
      };
      QUnit.equal(prop.setProperty('object', ref), false,
          'cannot store objects');
      QUnit.equal(prop.getProperty('object'), undefined,
          'undefined objects are undefined');
    });
  };
});
