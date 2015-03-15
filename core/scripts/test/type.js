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
    var Type;

    Type = getModule('core/type');

    QUnit.test('Type', function() {
      var types, ref, functionnames;

      /*
       * Preparation
       */

      types = [];

      types.push(5);
      types.push({
        asd: 123
      });
      types.push('');
      types.push(undefined);
      types.push(null);
      types.push(new Date(1234567890123));
      types.push([1, 5, 'asd']);
      types.push(/arbitrary regex/);
      types.push(false);
      types.push(function() {
        return '3.1415';
      });

      ref = ['number', 'object', 'string', 'undefined', 'null', 'date',
          'array', 'regexp', 'boolean', 'function'];

      /*
       * Type()
       */

      ref.forEach(function(typename, index) {
        QUnit.equal(Type(types[index]), typename, 'Type ' + typename
            + ' detected');
      });

      functionnames = ref.map(function(typename) {
        return 'is' + [typename[0].toUpperCase() + typename.slice(1)];
      });

      /*
       * Type.is and Type.isType existance
       */

      QUnit.ok(Type.is, 'Type.is exists');
      QUnit.equal(Type(Type.is), 'function', 'Type.is() is a function');
      functionnames.forEach(function(functionname) {
        QUnit.ok(Type[functionname], 'Type.' + functionname + ' exists');
        QUnit.equal(Type(Type[functionname]), 'function', 'Type.'
            + functionname + '() is a function');
      });

      /*
       * Type.isType()
       */

      types.forEach(function(type, typeindex) {
        functionnames.forEach(function(functionname, functionindex) {
          var expected = functionindex === typeindex;
          QUnit.equal(Type[functionname](type), expected, 'Type.'
              + functionname + ' on a ' + Type(type) + ' is ' + expected);
        });
      });

      /*
       * Type.is()
       */

      types.forEach(function(type, typeindex) {
        ref.forEach(function(refname, functionindex) {
          var expected = functionindex === typeindex;
          QUnit.equal(Type.is(type, refname), expected, 'Type.is(obj, '
              + refname + ') on a ' + Type(type) + ' is ' + expected);
        });
      });

    });
  };
});
