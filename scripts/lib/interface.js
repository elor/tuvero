/**
 * Interface class for definition and testing purposes
 * 
 * Allows the validation of Java-inspired interfaces.
 * 
 * An interface is a JavaScript object that contains only constants (objects and
 * arrays), global functions and a mandatory object called "Interface", which in
 * turn contains only placeholder functions and other interfaces.
 * 
 * Every implementation of an interface must be a JavaScript class, i.e. it can
 * be allocated with the new keyword.
 * 
 * Note to self: console.log is for debugging, console.warn is considered output
 * 
 * TODO: return a list of errors instead of true/false
 */
define([ '../lib/toType' ], function (toType) {
  var Interface, Example, print;

  print = false;

  Example = {
    Interface : {
      asd : 5
    }
  };

  Example = {
    Interface : {
      /**
       * An example function for an interface
       * 
       * @param {Integer}
       *          argument An arbitrary argument
       * @returns {boolean} true on default, false otherwise
       */
      exampleFunction : function (argument) {
        return true;
      },

      obj : Example
    },

    CONSTANT : {
      SUCCESS : 0,
      FAILURE : -1
    },

    ARRAY : [ 1, 1, 2, 3, 5 ],

    STRING : "asd",

  };

  /**
   * checks the internal interface object for compliance
   * 
   * @param {Object}
   *          obj the object
   * @returns {boolean} true if obj is an Interface Object, false otherwise
   */
  function validateObject (obj) {
    var key, keys, val;

    keys = Object.keys(obj);

    for (key in keys) {
      key = keys[key];
      val = obj[key];
      switch (toType(val)) {
      case 'object':
        // must be an interface
        if (validate(val) === false) {
          print && console.warn([ "obj.[", key, "]: is no interface" ].join(''));
          return false;
        }
        break;
      case 'function':
        // any function is fine at the moment
        break;
      default:
        print && console.warn([ "obj[", key, "] = ", val, ": invalid type: ",
            toType(val) ].join(''));
        return false;
      }
    }

    return true;
  }

  /**
   * test whether a string is all caps
   * 
   * @param {String}
   *          str the string to test
   * @returns true if str is all caps, false otherwise
   */
  function isCaps (str) {
    return /^[A-Z]+$/.test(str);
  }

  /**
   * test recursively whether the object is a constant
   * 
   * TODO: catch nesting loop
   * 
   * @param {Object}
   *          obj the object to test
   * @returns {boolean} true if obj is constant, false otherwise
   */
  function isConstant (obj) {
    var keys, key;

    switch (toType(obj)) {
    case 'object':
      keys = Object.keys(obj);
      for (key in keys) {
        key = keys[key];

        // check for all caps key, since it's a constant
        if (isCaps(key) === false) {
          print && console.warn([ "obj.[", key, "]: is not all caps" ].join(''));
          return false;
        }

        // check recursively for constant
        if (isConstant(obj[key]) === false) {
          print && console.warn([ "obj.[", key, "]: object is no constant" ].join(''));
          return false;
        }
      }

      // didn't return earlier, so obj must be a constant
      return true;
    case 'array':
      for (elem in obj) {
        elem = obj[elem];
        if (isConstant(elem) === false) {
          print && console.warn([ "obj.[", elem, "]: array is no constant" ].join(''));
          return false;
        }
      }

      // didn't return earlier, so obj must be a constant
      return true;
    case 'number':
    case 'string':
    case 'undefined':
    case 'boolean':
    case 'regexp':
      // TODO Did I miss a type?
      return true;
    default:
      print && console.warn([ "invalid type: ", totype(obj) ].join(''));
      return false;
    }
  }

  /**
   * validate an interface object
   * 
   * TODO: catch interface nesting loops
   * 
   * TODO: enforce naming conventions
   * 
   * @param {Interface}
   *          intf A candidate for an interface
   * @returns {boolean} true if intf is an interface, false otherwise
   */
  function validate (intf) {
    var keys, key;

    keys = Object.keys(intf);

    // abort if there's no Interface key
    if (keys.indexOf('Interface') === -1) {
      print && console.warn("intf.Interface: not found");
      return false;
    }

    // validate the interface object
    if (validateObject(intf.Interface) === false) {
      print && console.warn([ "intf.Interface: is no interface object" ].join(''));
      return false;
    }

    for (key in keys) {
      key = keys[key];
      if (key === 'Interface') {
        continue;
      }

      // enforce all caps
      if (isCaps(key) === false) {
        print && console.warn([ "intf.[", key, "]: is not all caps" ].join(''));
        return false;
      }

      // test for constant
      if (isConstant(intf[key]) === false) {
        print && console.warn([ "intf.[", key, "]: is not constant" ].join(''));
        return false;
      }
    }

    return true;
  }

  /**
   * return an array with unique values while preserving the order of first
   * appearance. Lazy O(n^2) version
   * 
   * @param {Array}
   *          array with arbitrary elements
   * @returns {Array} a tight-packed array with unique values
   * 
   * TODO extract to my own array library
   */
  function arrayUnique (array) {
    var out, value;

    out = [];
    value = undefined;

    for (value in array) {
      value = array[value];
      if (out.indexOf(value) === -1) {
        out.push(value);
      }
    }

    return out;
  }

  /**
   * returns keys that are unique to either array
   * 
   * @param {array}
   *          a, the first array
   * @param {array}
   *          b, the second array
   * @returns {object} an object containing the unique keys for each array
   * 
   * TODO extract to my own array library
   */
  function arrayDiff (a, b) {
    var out, i, j;

    out = {
      a : [],
      b : [],
      shared : []
    };

    a = arrayUnique(a).sort();
    b = arrayUnique(b).sort();

    i = a.length - 1;
    j = b.length - 1;

    for (; i >= 0; i -= 1) {
      for (; a[i] < b[j] && j >= 0; j -= 1) {
        out.b.push(b[j]);
      }

      if (j >= 0 && a[i] === b[j]) {
        out.shared.push(a[i]);
        j -= 1;
      } else {
        out.a.push(a[i]);
      }
    }

    for (; j >= 0; j -= 1) {
      out.b.push(b[j]);
    }

    // reverse to order of first appearance
    out.a.reverse();
    out.b.reverse();

    return out;
  }

  /**
   * retrieve all keys of an object from itself, its prototype (if it's a class)
   * or the prototype if its class. Recursive.
   * 
   * @param {instance,
   *          class} obj the object or class
   * @returns {string array} an array of all referenced keys
   */
  function getObjectKeys (obj) {
    var out, isClass, isInstance;

    isFunction = obj.prototype === undefined && toType(obj) === 'function';
    isClass = obj.prototype !== undefined && toType(obj) === 'function';
    isInstance = obj.constructor !== undefined && toType(obj) === 'object';

    if (isInstance) {
      out = Object.keys(obj);
      if (obj !== obj.constructor.prototype) {
        out = arrayUnique(out.concat(getObjectKeys(obj.constructor)));
      }
    } else if (isClass) {
      out = getObjectKeys(obj.prototype);
    } else if (isFunction) {
      out = Object.keys(obj);
    } else {
      return undefined;
    }

    return out;
  }

  /**
   * Performs an interface match
   * 
   * @param {Interface}
   *          intf the interface to match against
   * @param {object}
   *          obj the implementation
   * @param {boolean}
   *          noMoreFuncs disallow additional functions
   * @param {boolean}
   *          NoMoreMembers disallow additional members
   * @param {boolean}
   *          recurse match interfaces recursively
   * @returns {boolean} true it if matches, false otherwise
   */
  function matchInterface (intf, obj, noMoreFuncs, noMoreMembers, recurse) {
    var ikeys, okeys, diff, tmp, i, err;

    ikeys = Object.keys(intf.Interface).sort();
    okeys = getObjectKeys(obj).sort();

    // compare names
    // create diff
    diff = arrayDiff(ikeys, okeys);
    // reference for better understanding
    diff.i = diff.a;
    diff.o = diff.b;

    // print && console.log(ikeys);
    // print && console.log(okeys);
    // print && console.log([ diff.i, diff.shared, diff.o ].join(' | '));

    // if interface keys are missing, abort with console.warn
    if (diff.i.length !== 0) {
      print && console.warn([
          "match: missing keys in implementation or class: ", diff.i.join(', ') ].join(''));
      return false;
    }

    // if there are additional members in the implementation, compare
    // with noMoreFuncs and noMoreMembers and the object member's type
    if (diff.o.length !== 0 && (noMoreMembers || noMoreFuncs)) {
      err = [];
      // find all differences
      for (i in diff.o) {
        i = diff.o[i];
        if (noMoreMembers && toType(obj[i]) !== 'function') {
          err.push(i);
        }
        if (noMoreFuncs && toType(obj[i]) === 'function') {
          err.push(i);
        }
      }
      if (err.length !== 0) {
        print && console.warn([ "extra keys: ", err.join(', ') ].join(''));
        return false;
      }
    }

    err = [];
    // match the types of each shared key
    for (tmp in diff.shared) {
      tmp = diff.shared[tmp];
      i = toType(intf.Interface[tmp]);
      if (obj.prototype !== undefined) {
        j = toType(obj.prototype[tmp]);
        // this is a class
      } else {
        j = toType(obj[tmp]);
      }

      if (i === j) {
        // match sub-interface
        if (recurse && i === 'object') {
          if (matchInterface(intf.Interface[tmp], obj[tmp], noMoreFuncs, noMoreMembers, recurse) !== true) {
            err.push([ tmp, ':subintf mismatch' ].join(''));
          }
        }
      } else {
        err.push([ tmp, ':', j, '!=', i ].join(''));
      }
    }

    if (err.length !== 0) {
      print && console.warn([ "type mismatch:", err.join(', ') ].join(''));
      return false;
    }

    return true;
  }

  /**
   * Tests the implementation against the interface
   * 
   * opts string characters:
   * 
   * 'i' - also validate the interface using validate()
   * 
   * 'r' - check sub-interfaces recursively
   * 
   * 'f' - disallow additional functions
   * 
   * 'm' - disallow additional members, including functions
   * 
   * @param {Interface}
   *          intf The interface to match against
   * @param {object}
   *          obj the implementation
   * @param {string}
   *          opts string of option characters (see above) Default: ""
   * @returns true if they match, false if they dont, undefined on other error
   */
  function match (intf, obj, opts) {
    var testIntf, noMoreFuncs, noMoreMembers, tmp, err, recurse;

    testIntf = noMoreFuncs = noMoreMembers = err = false;

    if (!intf) {
      print && console.warn("missing interface to match against");
      err = true;
    }

    if (!obj && obj != {}) {
      print && console.warn("missing object for matching");
      err = true;
    }

    opts = opts || "";

    tmp = ''; // stub to please jslint

    opts.split('');
    for (tmp in opts) {
      tmp = opts[tmp];
      switch (tmp) {
      case 'i':
        testIntf = true;
        break;
      case 'r':
        recurse = true;
        break;
      case 'f':
        noMoreFuncs = true;
        break;
      case 'm':
        noMoreMembers = true;
        break;
      default:
        print && console.warn([ 'unknown character in opts "', opts, '": ', tmp ].join(''));
        err = true;
        break;
      }
    }

    if (err) {
      print && console.warn('aborting on invalid arguments');
      return undefined;
    }

    if (testIntf && (validate(intf) == false)) {
      print && console.warn('match(): intf is no interface');
      return false;
    }

    return matchInterface(intf, obj, noMoreFuncs, noMoreMembers, recurse);
  }

  /**
   * calls its internal functions validate() or match():
   * 
   * 1 argument ->validate()
   * 
   * 2 or 3 arguments -> match()
   * 
   * @param {Interface}
   *          intf an interface object
   * @param {object}
   *          obj (optional) an object to match against intf
   * @param {string}
   *          opts (optional) match options. See match()
   * 
   */
  Interface = function () {
    switch (arguments.length) {
    case 1:
      return validate(arguments[0]);
    case 2:
      return match(arguments[0], arguments[1]);
    case 3:
      return match(arguments[0], arguments[1], arguments[2]);
    default:
      print && console.error([ "Interface(): invalid number of arguments: ",
          arguments.length ].join(''));
    }
  };
  Interface.prototype = undefined;

  /**
   * Tests whether the Interface consists only of functions and other interfaces
   * 
   * @param {Interface}
   *          intf A candidate for an interface
   * @returns {boolean} true if intf is an interface, false otherwise
   */
  Interface.validate = validate;

  /**
   * Tests the implementation against the interface
   * 
   * opts string characters:
   * 
   * 'i' - also validate the interface using validate()
   * 
   * 'r' - check sub-interfaces recursively
   * 
   * 'f' - disallow additional functions
   * 
   * 'm' - disallow additional members, including functions
   * 
   * @param {Interface}
   *          intf The interface to match against
   * @param {object}
   *          obj the implementation
   * @param {string}
   *          opts string of option characters (see above) Default: ""
   * @returns true if they match, false if they dont, undefined on other error
   */
  Interface.match = match;

  /**
   * Enable/Disable console output
   * 
   * @param {boolean}
   *          printErrors whether to print errors
   */
  Interface.verbose = function (printErrors) {
    if (toType(printErrors) === 'boolean') {
      print = printErrors;
    } else {
      print && console.warn("Interface.verbose(): invalid input type: not boolean");
    }
  };

  return Interface;
});
