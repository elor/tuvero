/**
 * Interface class for definition and testing purposes
 * 
 * Allows the validation of Java-inspired interfaces.
 * 
 * An interface is a JavaScript object that contains only constants (objects and
 * arrays), global functions and a mandatory object called "Interface", which in
 * turn contains only placeholder functions and other interfaces.
 * 
 * An implementation can be a javascript object, an instance of a class or a
 * function with assigned members. Matching of constructor functions can be
 * performed as long as all functions are members of its prototype.
 * 
 * Note to self: console.log is for debugging, console.warn is considered output
 * 
 * TODO: return a list of errors instead of true/false
 * 
 * TODO: allow global functions?
 * 
 * TODO: watch call stack to avoid infinite loops
 */
define([ '../lib/toType' ], function (toType) {
  var Interface, Example;

  /**
   * checks the internal interface object for compliance
   * 
   * @param {Object}
   *          obj the object
   * @param {Array}
   *          err (output) an array to which error lines are pushed
   */
  function validateObject (obj, err) {
    var key, keys, val;

    keys = Object.keys(obj);

    for (key in keys) {
      key = keys[key];
      val = obj[key];
      switch (toType(val)) {
      case 'object':
        // must be an interface
        validateInterface(val, err);
        break;
      case 'function':
        // any function is fine at the moment
        break;
      default:
        err.push([ "obj.", key, " = ", val, ": invalid type: ", toType(val) ].join(''));
      }
    }
  }

  /**
   * test whether a string is all caps
   * 
   * @param {String}
   *          str the string to test
   * @returns {boolean} true if str is all caps, false otherwise
   */
  function isCaps (str) {
    return /^[A-Z]+$/.test(str);
  }

  /**
   * test whether a string is a valid lower case function name
   * 
   * @param {String}
   *          str the potential function name
   * @returns {boolean} true on match
   */
  function isFunctionName (str) {
    return /^[a-z][a-zA-Z0-9]*/.test(str);
  }

  /**
   * test recursively whether the object is a constant
   * 
   * TODO: catch nesting loop
   * 
   * @param {Object}
   *          obj the object to test
   */
  function isConstant (obj, err) {
    var keys, key;

    switch (toType(obj)) {
    case 'object':
      keys = Object.keys(obj);
      for (key in keys) {
        key = keys[key];

        // check for all caps key, since it's a constant
        if (isCaps(key) === false) {
          err.push([ "obj.", key, ": nested constant is not all caps" ].join(''));
        }

        // check recursively for constant
        isConstant(obj[key], err);
      }
      break;
    case 'array':
      for (elem in obj) {
        elem = obj[elem];
        isConstant(elem, err);
      }
      break;
    case 'number':
    case 'string':
    case 'undefined':
    case 'boolean':
    case 'regexp':
      break;
    default:
      err.push([ "invalid type for a constant: ", toType(obj) ].join(''));
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
   * @param {Array}
   *          err (output) array of errors
   */
  function validateInterface (intf, err) {
    var keys, key;

    if (toType(intf) !== 'object') {
      err.push([ "intf.validate: invalid argument type: ", toType(intf) ].join(''));
    } else {
      keys = Object.keys(intf);
      // abort if there's no Interface key
      if (keys.indexOf('Interface') === -1) {
        err.push("intf.Interface: not found");
      } else {
        // validate the interface object
        validateObject(intf.Interface, err);

        for (key in keys) {
          key = keys[key];
          if (key === 'Interface') {
            continue;
          }

          // enforce all caps
          if (isCaps(key) === false) {
            err.push([ "intf.", key, ": constant is not all caps" ].join(''));
          }

          // test for constant
          isConstant(intf[key], err);
        }
      }
    }
  }

  /**
   * wrapper around validateInterface
   * 
   * @param {Interface}
   *          intf the interface to validate
   * @returns {string} a newline-separated string of errors. "" on success
   */
  function validate (intf) {
    var err = [];

    validateInterface(intf, err);

    return err.join('\n');
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
   * @param {array}
   *          err (output) array of errors
   */
  function matchInterface (intf, obj, noMoreFuncs, noMoreMembers, recurse, err) {
    var ikeys, okeys, diff, tmp, i;

    ikeys = Object.keys(intf.Interface).sort();
    okeys = getObjectKeys(obj).sort();

    // compare names
    // create diff
    diff = arrayDiff(ikeys, okeys);
    // reference for better understanding
    diff.i = diff.a;
    diff.o = diff.b;

    console.log(ikeys);
    console.log(okeys);
    console.log([ diff.i, diff.shared, diff.o ].join(' | '));

    // if interface keys are missing, abort with console.warn
    if (diff.i.length !== 0) {
      err.push([ "match: missing keys in implementation or class: ",
          diff.i.join(', ') ].join(''));
    }

    // if there are additional members in the implementation, compare
    // with noMoreFuncs and noMoreMembers and the object member's type
    if (diff.o.length !== 0 && (noMoreMembers || noMoreFuncs)) {
      // find all differences
      for (i in diff.o) {
        i = diff.o[i];
        if (noMoreMembers && toType(obj[i]) !== 'function') {
          err.push([ "unallowed extra member: ", i ].join(''));
        }
        if (noMoreFuncs && toType(obj[i]) === 'function') {
          err.push([ "unallowed extra function: ", i ].join(''));
        }
      }
    }

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
          matchInterface(intf.Interface[tmp], obj[tmp], noMoreFuncs, noMoreMembers, recurse, err);
        }
      } else {
        err.push([ "type mismatch of ", tmp, ": ", j, " != ", i ].join(''));
      }
    }
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
   * @param {array}
   *          err (output) an array of errors
   */
  function prepareMatch (intf, obj, opts, err) {
    var testIntf, noMoreFuncs, noMoreMembers, tmp, recurse, critical;

    testIntf = noMoreFuncs = noMoreMembers = critical = false;

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
        err.push([ 'unknown character in opts "', opts, '": ', tmp ].join(''));
        critical = true;
        break;
      }
    }

    if (!critical) {
      if (!intf) {
        err.push("missing interface to match against");
        critical = true;
      } else if (toType(intf) !== 'object') {
        err.push([ "Interface.match(): invalid type of intf: ", toType(intf) ].join(''));
        critical = true;
      } else if (testIntf) {
        critical = err.length;
        validateInterface(intf, err);
        critical = err.length !== critical;
      }

      if (!obj && obj !== {}) {
        err.push("missing object for matching");
        critical = true;
      } else if (toType(obj) !== 'object' && toType(obj) !== 'function') {
        err.push([ 'object has invalid type: ', toType(obj) ].join(''));
        critical = true;
      }

    }

    if (!critical) {
      matchInterface(intf, obj, noMoreFuncs, noMoreMembers, recurse, err);
    }
  }

  /**
   * a wrapper around matchInterface(). see matchInterface() for information on
   * the parameters and options
   * 
   * @returns {string} a newline-separated string of errors
   */
  function match (intf, obj, opts) {
    var err;

    err = [];

    prepareMatch(intf, obj, opts, err);

    return err.join('\n');
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
   *          opts (optional) match options. See prepareMatch()
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
      return [ "Interface(): invalid number of arguments: ", arguments.length ].join('');
    }
  };
  // disallow instantiation
  Interface.prototype = undefined;

  /**
   * Tests whether the Interface consists only of functions and other interfaces
   * 
   * @param {Interface}
   *          intf A candidate for an interface
   * @returns {string} a newline-separated string with error description. "" on
   *          match.
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
   * @returns {string} a newline-separated string with error description. "" on
   *          match.
   */
  Interface.match = match;

  return Interface;
});
