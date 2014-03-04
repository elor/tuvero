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
 * TODO: allow global functions
 * 
 * TODO: array interface
 */
define([ '../lib/toType' ], function (toType) {
  var Interface;

  /**
   * search for the object in the stack and abort if present, clone and push
   * otherwise
   * 
   * @param {array}
   *          stack a stack of objects
   * @param {object}
   *          obj an object
   * @returns {array} a new stack with obj on top or undefined if obj is already
   *          present
   */
  function getStack (stack, obj) {
    var newstack;

    if (stack.indexOf(obj) !== -1) {
      return undefined;
    }

    newstack = stack.slice();
    newstack.push(obj);

    return newstack;
  }

  /**
   * create a fresh bistack
   * 
   * @returns {object} a bistack for use with getBiStack
   */
  function createBiStack () {
    return {
      i : [],
      o : []
    };
  }

  /**
   * getStack for two objects at once (here: interface and object)
   * 
   * @param {object}
   *          bistack the bistack itself
   * @param {Interface}
   *          intf
   * @param {object}
   *          obj
   * @returns {object} undefined if an infinite recursion is detected, an
   *          updated bistack otherwise
   */
  function getBiStack (bistack, intf, obj) {
    var newbistack, index;

    // loop instead of if, because multiple instances of intf and obj are
    // possible. Since hierarchies should be
    for (index = 0; index < bistack.i.length; index += 1) {
      if (bistack.i[index] === intf && bistack.o[index] === obj) {
        return undefined;
      }
    }

    newbistack = {
      i : bistack.i.slice(),
      o : bistack.o.slice()
    };

    newbistack.i.push(intf);
    newbistack.o.push(obj);

    return newbistack;
  }

  /**
   * checks the internal interface object for compliance
   * 
   * @param {Object}
   *          obj the object
   * @param {Array}
   *          err (output) an array to which error lines are pushed
   */
  function validateInterfaceObject (obj, err, stack) {
    var key, keys, val;

    stack = getStack(stack, obj);
    if (!stack) {
      // infinite nesting is not an error, as long as the rest of the Interface
      // is valid
      return;
    }

    keys = Object.keys(obj);

    for (key in keys) {
      key = keys[key];
      val = obj[key];
      switch (toType(val)) {
      case 'object':
        // must be an interface
        validateInterface(val, err, stack);
        break;
      case 'function':
        // any function is fine at the moment
        break;
      default:
        err.push([ stack.length, " invalid type for key ", key, ': ',
            toType(val) ].join(''));
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
  function validateConstantName (str) {
    return /^[A-Z]+$/.test(str);
  }

  /**
   * test whether a string is a valid lower case function name
   * 
   * @param {String}
   *          str the potential function name
   * @returns {boolean} true on match
   */
  function validateFunctionName (str) {
    return /^[a-z][a-zA-Z0-9]*/.test(str);
  }

  /**
   * test recursively whether the object is a constant
   * 
   * @param {Object}
   *          obj the object to test
   */
  function validateConstant (obj, err, stack) {
    var keys, key;

    stack = getStack(stack, obj);
    if (!stack) {
      // infinite nesting is not an error, as long as the rest of the Interface
      // is valid
      return;
    }

    switch (toType(obj)) {
    case 'object':
      keys = Object.keys(obj);
      for (key in keys) {
        key = keys[key];

        // check for all caps key, since it's a constant
        if (validateConstantName(key) === false) {
          err.push([ stack.length, " nested constant is not all caps:", key ].join(''));
        }

        // check recursively for constant
        validateConstant(obj[key], err, stack);
      }
      break;
    case 'array':
      for (elem in obj) {
        elem = obj[elem];
        validateConstant(elem, err, stack);
      }
      break;
    case 'number':
    case 'string':
    case 'undefined':
    case 'boolean':
    case 'regexp':
      break;
    default:
      err.push([ stack.length, " invalid type for a constant: ", toType(obj) ].join(''));
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
  function validateInterface (intf, err, stack) {
    var keys, key;

    stack = getStack(stack, intf);
    if (!stack) {
      // infinite nesting is not an error, as long as the rest of the Interface
      // is valid
      return;
    }

    if (toType(intf) !== 'object') {
      err.push([ stack.length, " intf is no object, but of type ", toType(intf) ].join(''));
    } else {
      keys = Object.keys(intf);

      // abort if there's no Interface key
      if (keys.indexOf('Interface') === -1) {
        err.push([ stack.length, " intf.Interface: not found" ].join(''));
      } else {
        for (key in keys) {
          key = keys[key];
          switch (key) {
          case 'Interface':
            // validate the interface object
            validateInterfaceObject(intf.Interface, err, stack);
            break;
          case 'Extends':
          case 'Requires':
            // validate Extends as array and its elements of it as Interfaces
            validateInterfaceArray(intf[key], err, stack);
            break;
          default:
            if (validateConstantName(key) === true) {
              validateConstant(intf[key], err, stack);
              // } else if (validateFunctionName(key) === true) {
              // if (toType(intf[key] !== 'function')) {
              // err.push([ stack.length, 'invalid type for global function ',
              // key, ':', toType(intf[key]), '. Did you mean ',
              // key.toUpperCase(), '?' ].join(''));
              // }
            } else {
              err.push([ stack.length, "invalid name: ", key,
                  ". Is neither CONSTANTNAME nor functionName" ].join(''));
            }
          }
        }
      }
    }
  }

  /**
   * validate an array of interfaces
   * 
   * @param {array}
   *          array a compact array of interfaces
   * @param {array}
   *          err an array of errors
   * @param {object}
   *          stack a stack for infinite loop avoidance
   */
  function validateInterfaceArray (array, err, stack) {
    var intf, type, count;

    type = toType(array);
    if (type !== 'array') {
      err.push([ stack.length, ' array of interfaces is no array, but ', type ]);
    } else {
      count = 0;
      for (intf in array) {
        intf = array[intf];
        validateInterface(intf, err, stack);
        count += 1;
      }
      if (array.length !== count) {
        err.push([ stack.length, 'array if interfaces is not compact' ].join(''));
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
    var err, stack;

    err = [];
    stack = [];

    validateInterface(intf, err, stack);

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
  function arrayUniq (array) {
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

    a = arrayUniq(a).sort();
    b = arrayUniq(b).sort();

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
    var out, isClass, isInstance, isFunction;

    isFunction = obj.prototype === undefined && toType(obj) === 'function';
    isClass = obj.prototype !== undefined && toType(obj) === 'function';
    isInstance = obj.constructor !== undefined && toType(obj) === 'object';

    if (isInstance) {
      out = Object.keys(obj);
      if (obj !== obj.constructor.prototype) {
        out = arrayUniq(out.concat(getObjectKeys(obj.constructor)));
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
   * retrieves all keys if .Interface and .Extends
   * 
   * @param {object}
   *          intf the interface
   * @param {object}
   *          stack a stack for infinite loop avoidance
   * @returns {array} an array of effective interfaces
   */
  function getInterfaceKeys (intf, stack) {
    var stack, sub, subkeys, keys;

    stack = stack || [];

    stack = getStack(stack, intf);
    if (stack === undefined) {
      return [];
    }

    keys = Object.keys(intf.Interface);

    if (intf.Extends) {
      for (sub in intf.Extends) {
        sub = intf.Extends[sub];
        subkeys = getInterfaceKeys(sub, stack);
        for (subkey in subkeys) {
          subkey = subkeys[subkey];
          // append uniquely
          if (keys.indexOf(subkey) === -1) {
            keys.push(subkey);
          }
        }
      }
    }

    console.log(keys);
    return keys;
  }

  /**
   * recurse the Extends tree until the key is found
   */
  function getInterfaceMember (intf, key, stack) {
    var index, sub, retval;
    stack = stack || [];

    if (!intf) {
      return undefined;
    }

    stack = getStack(stack, intf);
    if (stack === undefined) {
      return undefined;
    }

    if (intf.Interface && intf.Interface[key] !== undefined) {
      return intf.Interface[key];
    }

    if (intf.Extends) {
      for (index = intf.Extends.length; index >= 0; index -= 1) {
        sub = intf.Extends[index];
        retval = getInterfaceMember(sub, key, stack);
        if (retval !== undefined) {
          return retval;
        }
      }
    }

    return undefined;
  }

  /**
   * Performs an interface match
   * 
   * @param {Interface}
   *          intf the interface to match against
   * @param {object}
   *          obj the implementation
   * @param {Object}
   *          opts different options. see matchInterface() source code for a
   *          complete list
   * @param {object}
   *          a bistack for infinite loop avoidance
   * @param {array}
   *          err (output) array of errors
   */
  function compareKeys (intf, obj, opts, err, bistack) {
    var ikeys, okeys, diff, key, iType, oType, index;

    bistack = getBiStack(bistack, intf, obj);
    if (bistack === undefined) {
      // infinite loop, but still valid unless other errors are found
      return;
    }

    ikeys = getInterfaceKeys(intf).sort();
    okeys = getObjectKeys(obj).sort();

    // compare names
    // create diff
    diff = arrayDiff(ikeys, okeys);
    // reference for better understanding
    diff.i = diff.a;
    diff.o = diff.b;

    // console.log(ikeys);
    // console.log(okeys);
    // console.log([ diff.i, diff.shared, diff.o ].join(' | '));

    // if interface keys are missing, abort with console.warn
    if (diff.i.length !== 0) {
      err.push([ "match: missing keys in implementation or class: ",
          diff.i.join(', ') ].join(''));
    }

    // if there are additional members in the implementation, compare
    // with noMoreFuncs and noMoreMembers and the object member's type
    if (diff.o.length !== 0 && (opts.noMoreMembers || opts.noMoreFuncs)) {
      // find all differences
      for (key in diff.o) {
        key = diff.o[key];
        if (opts.noMoreMembers && toType(obj[key]) !== 'function') {
          err.push([ "unallowed extra member: ", key ].join(''));
        }
        if (opts.noMoreFuncs && toType(obj[key]) === 'function') {
          err.push([ "unallowed extra function: ", key ].join(''));
        }
      }
    }

    // match the types of each shared key
    for (key in diff.shared) {
      key = diff.shared[key];
      iType = toType(getInterfaceMember(intf, key));
      if (obj.prototype !== undefined) {
        // this is a class
        oType = toType(obj.prototype[key]);
      } else {
        // this is an object, implementation or specially prepared function
        oType = toType(obj[key]);
      }

      if (iType === oType) {
        // match sub-interface
        if (opts.recurse && iType === 'object') {
          compareKeys(intf.Interface[key], obj[key], opts, err, bistack);
        }
      } else {
        err.push([ "type mismatch of ", key, ": ", oType, " != ", iType ].join(''));
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
  function matchInterface (intf, obj, opts, err) {
    var options, opt, critical, bistack;

    critical = false;

    options = {
      noMoreFuncs : false,
      noMoreMembers : false,
      recurse : false,
      testIntf : false
    };

    opts = opts || "";

    opts.split('');
    for (opt in opts) {
      opt = opts[opt];
      switch (opt) {
      case 'i':
        options.testIntf = true;
        break;
      case 'r':
        options.recurse = true;
        break;
      case 'f':
        options.noMoreFuncs = true;
        break;
      case 'm':
        options.noMoreMembers = true;
        break;
      default:
        err.push([ 'unknown character in opts "', opts, '": ', opt ].join(''));
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
      } else if (options.testIntf) {
        critical = err.length;
        validateInterface(intf, err, []);
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
      bistack = createBiStack();
      compareKeys(intf, obj, options, err, bistack);
    }
  }

  /**
   * a wrapper around matchInterface(). see matchInterface() for information on
   * the parameters and options
   * 
   * @returns {string} a newline-separated string of errors
   */
  function match (intf, obj, opts) {
    var err, stack;

    err = [];
    stack = [];

    matchInterface(intf, obj, opts, err);

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
   *          opts (optional) match options. See matchInterface()
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
