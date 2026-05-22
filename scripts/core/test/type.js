/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import Type from '../type.js';
test('Type', () => {
  var types, ref, functionnames, constructors;

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
  types.push(function () {
    return '3.1415';
  });
  ref = ['number', 'object', 'string', 'undefined', 'null', 'date', 'array', 'regexp', 'boolean', 'function'];
  constructors = [Number, Object, String, undefined, null, Date, Array, RegExp, Boolean, Function];

  /*
   * Type()
   */

  ref.forEach(function (typename, index) {
    expect(Type(types[index]), 'Type ' + typename + ' detected').toBe(typename);
  });
  functionnames = ref.map(function (typename) {
    return 'is' + [typename[0].toUpperCase() + typename.slice(1)];
  });

  /*
   * Type.is and Type.isType existance
   */

  expect(Type.is, 'Type.is exists').toBeTruthy();
  expect(Type(Type.is), 'Type.is() is a function').toBe('function');
  functionnames.forEach(function (functionname) {
    expect(Type[functionname], 'Type.' + functionname + ' exists').toBeTruthy();
    expect(Type(Type[functionname]), 'Type.' + functionname + '() is a function').toBe('function');
  });

  /*
   * Type.isType()
   */

  types.forEach(function (type, typeindex) {
    functionnames.forEach(function (functionname, functionindex) {
      var expected = functionindex === typeindex;
      expect(
        Type[functionname](type),
        'Type.' + functionname + ' on a ' + Type(type) + ' is ' + expected
      ).toBe(expected);
    });
  });

  /*
   * Type.is()
   */

  types.forEach(function (type, typeindex) {
    ref.forEach(function (refname, functionindex) {
      var expected = functionindex === typeindex;
      expect(
        Type.is(type, refname),
        'Type.is(obj, "' + refname + '") on a ' + Type(type) + ' is ' + expected
      ).toBe(expected);
    });
  });
  types.forEach(function (type, typeindex) {
    constructors.forEach(function (constructor, functionindex) {
      var expected = functionindex === typeindex;
      expect(
        Type.is(type, constructor),
        'Type.is(obj, ' + constructor + ') on a ' + Type(type) + ' is ' + expected
      ).toBe(expected);
    });
  });
});