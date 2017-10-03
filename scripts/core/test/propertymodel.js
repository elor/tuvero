/**
 * Model class tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var PropertyModel;

    PropertyModel = getModule('core/propertymodel');

    QUnit.test('PropertyModel', function (assert) {
      var prop, listener, ref, savedata;

      prop = new PropertyModel();
      assert.ok(prop !== undefined, 'empty initialization is allowed');
      assert.equal(prop.getProperty('someprop'), undefined,
          'access to undefined keys returns undefined');

      listener = {
        success: false,
        onupdate: function() {
          this.success = true;
        },
        emitters: []
      };

      prop.registerListener(listener);

      assert.equal(prop.setProperty('name', 'Some Name'), true,
          'setProperty() returns true');
      assert.equal(listener.success, true, 'setProperty() emits update event');
      assert.equal(prop.getProperty('name'), 'Some Name',
          'setProperty() actually stores values');

      listener.success = false;
      assert.equal(prop.setProperty('name', 'Another Name'), true,
          'setProperty() returns true');
      assert.equal(listener.success, true, 'setProperty() emits update event');
      assert.equal(prop.getProperty('name'), 'Another Name',
          'setProperty() actually changes values');

      listener.success = false;
      assert.equal(prop.setProperty('name', 'Another Name'), false,
          'setProperty() returns false on no-change');
      assert.equal(listener.success, false,
          'setProperty() emits no update on no-change');
      assert.equal(prop.getProperty('name'), 'Another Name',
          'setProperty() did not change any values');

      ref = {
        asd: 'dsa',
        i: 5
      };
      assert.equal(prop.setProperty('object', ref), false,
          'cannot store objects');
      assert.equal(prop.getProperty('object'), undefined,
          'object references are not stored');

      assert.equal(prop.setProperty('array', [1, 2, 3]), false,
          'cannot store arrays');
      assert.equal(prop.getProperty('array'), undefined,
          'array object references are not stored');

      ref = function() {
        //
      };

      assert.equal(prop.setProperty('function', ref), false,
          'cannot store functions');
      assert.equal(prop.getProperty('function'), undefined,
          'function references are not stored');

      assert.equal(prop.setProperty('date', new Date()), false,
          'cannot store dates');
      assert.equal(prop.getProperty('date'), undefined, 'dates are not stored');

      assert.equal(prop.setProperty('regex', /dsa/), false,
          'cannot store regular expressions');
      assert.equal(prop.getProperty('regex'), undefined,
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
      assert.ok(savedata, 'save() works');

      prop = new PropertyModel();
      assert.equal(prop.restore(savedata), true, 'restore() works!');
      assert.equal(prop.getProperty('string'), 'somevalue', 'string restored');
      assert.equal(prop.getProperty('int'), 53241, 'int restored');
      assert.equal(prop.getProperty('float'), 53.241, 'float restored');
      assert.equal(prop.getProperty('boolean'), true, 'boolean restored');

      prop = new PropertyModel({
        bool: true,
        str: 'string',
        num: 123
      });

      assert.ok(prop, 'property model with default initialization');
      assert.equal(prop.getProperty('bool'), true, 'default bool property');
      assert.equal(prop.getProperty('str'), 'string', 'default str property');
      assert.equal(prop.getProperty('num'), 123, 'default num property');
    });
  };
});
