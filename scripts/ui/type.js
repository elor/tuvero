/**
 * A simple type verification library.
 *
 * In addition to the Type() and Type.is() functions, Type.isNumber(),
 * Type.isBoolean(), Type.isArray() etc. functions are available, but lack
 * additional documentation.
 *
 * @exports Type
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  var types;

  /**
   * helper function to capitalize a string
   *
   * @param str
   *          an arbitrary string of length > 0
   * @return the same string, with the first letter in upper case and the rest
   *          in lower case
   */
  function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  types = [1, , {}, '', undefined, null, new Date(), [], /asd/, true,
  /**
   * anonymous reference function
   */
  function() {
  }];

  /**
   * get the type string of an object, while also distinguishing between
   * objects, arrays, dates etc.
   *
   * @param obj
   *          the object
   * @return a lower-case single-word type string of the object.
   */
  function Type(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  /**
   * generic type comparison function. Other generic functions include:
   *
   * Type.isNumber(obj)
   *
   * Type.isObject(obj)
   *
   * Type.isString(obj)
   *
   * Type.isUndefined(obj)
   *
   * Type.isNull(obj)
   *
   * Type.isDate(obj)
   *
   * Type.isArray(obj)
   *
   * Type.isRegexp(obj)
   *
   * Type.isBoolean(obj)
   *
   * Type.isFunction(obj)
   *
   * @param obj
   *          the object
   * @param typestring
   *          the type string, as it may have been returned by Type()
   * @return true if the typestring matches Type(obj), false otherwise
   */
  Type.is = function(obj, typestring) {
    return Type(obj) === typestring;
  };

  /**
   * automatically creates the Type.isSomething functions
   */
  types.map(function(reference) {
    var typestring = Type(reference);
    /**
     * Type.isSomething() closure
     */
    Type['is' + capitalize(typestring)] = function(obj) {
      return Type.is(obj, typestring);
    };
  });

  return Type;
});
