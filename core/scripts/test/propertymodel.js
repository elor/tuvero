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
      var prop, listener, ref, savedata;

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
          'object references are not stored');

      QUnit.equal(prop.setProperty('array', [1, 2, 3]), false,
          'cannot store arrays');
      QUnit.equal(prop.getProperty('array'), undefined,
          'array object references are not stored');

      ref = function() {
        //
      };

      QUnit.equal(prop.setProperty('function', ref), false,
          'cannot store functions');
      QUnit.equal(prop.getProperty('function'), undefined,
          'function references are not stored');

      QUnit.equal(prop.setProperty('date', new Date()), false,
          'cannot store dates');
      QUnit.equal(prop.getProperty('date'), undefined, 'dates are not stored');

      QUnit.equal(prop.setProperty('regex', /dsa/), false,
          'cannot store regular expressions');
      QUnit.equal(prop.getProperty('regex'), undefined,
          'regular expressions are not stored');

      /*
       * save()/restore()
       */
      prop = new PropertyModel();
      prop.setProperty('string', 'somevalue');
      prop.setProperty('int', 53241);
      prop.setProperty('float', 53.241);
      prop.setProperty('boolean', true);

      savedata = prop.save();
      QUnit.ok(savedata, 'save() works');

      prop = new PropertyModel();
      QUnit.equal(prop.restore(savedata), true, 'restore() works!');
      QUnit.equal(prop.getProperty('string'), 'somevalue', 'string restored');
      QUnit.equal(prop.getProperty('int'), 53241, 'int restored');
      QUnit.equal(prop.getProperty('float'), 53.241, 'float restored');
      QUnit.equal(prop.getProperty('boolean'), true, 'boolean restored');

      prop = new PropertyModel({
        bool: true,
        str: 'string',
        num: 123
      });

      QUnit.ok(prop, 'property model with default initialization');
      QUnit.equal(prop.getProperty('bool'), true, 'default bool property');
      QUnit.equal(prop.getProperty('str'), 'string', 'default str property');
      QUnit.equal(prop.getProperty('num'), 123, 'default num property');
    });
  };
});
