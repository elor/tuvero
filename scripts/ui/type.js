/**
 * A simple type verification library.
 * 
 * In addition to the Type() and Type.is() functions, Type.isNumber(),
 * Type.isBoolean(), Type.isArray() etc. functions are available, but lack
 * additional documentation.
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 * @exports Type
 */

define(function () {
  var types;

  /**
   * helper function to capitalize a string
   * 
   * @param str
   *          an arbitrary string of length > 0
   * @returns the same string, with the first letter in upper case and the rest
   *          in lower case
   */
  function capitalize (str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  types = [ 1, , {}, '', undefined, null, new Date(), [], /asd/, true,
      function () {
      } ];

  /**
   * get the type string of an object, while also distinguishing between
   * objects, arrays, dates etc.
   * 
   * @param obj
   *          the object
   * @returns a lower-case single-word type string of the object.
   */
  function Type (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  /**
   * generic type comparison function. This function is mostly used by
   * Type.isNumber(), Type.isBoolean(), Type.isFunction(), Type.isArray(), etc.
   * 
   * @param obj
   *          the object
   * @param typestring
   *          the type string, as it may have been returned by Type()
   * @returns true if the typestring matches Type(obj), false otherwise
   */
  Type.is = function (obj, typestring) {
    return Type(obj) === typestring;
  };

  /**
   * automatically creates the Type.is... functions:
   * 
   * Type.isNumber
   * 
   * Type.isObject
   * 
   * Type.isString
   * 
   * Type.isUndefined
   * 
   * Type.isNull
   * 
   * Type.isDate
   * 
   * Type.isArray
   * 
   * Type.isRegexp
   * 
   * Type.isBoolean
   * 
   * Type.isFunction
   */
  types.map(function (reference) {
    var typestring = Type(reference);
    Type['is' + capitalize(typestring)] = function (obj) {
      return Type.is(obj, typestring);
    };
  });

  return Type;
});
