/**
 * Interface class for definition and testing purposes
 * 
 * An interface is a JavaScript object that contains only constants (objects and
 * arrays), global functions and a mandatory object called "Interface", which in
 * turn contains only placeholder functions and other interfaces.
 * 
 * Every implementation of an interface must be a JavaScript class, i.e. it can
 * be allocated with the new keyword.
 * 
 */

define(
    [ '../lib/toType' ],
    function (toType) {
      var Example, print;

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
      function isInterfaceObject (obj) {
        var key, keys, val;

        keys = Object.keys(obj);

        for (key in keys) {
          key = keys[key];
          val = obj[key];
          switch (toType(val)) {
          case 'object':
            // must be an interface
            if (isInterface(val) === false) {
              print
                  && console.error([ "obj.[", key, "]: is no interface" ]
                      .join(''));
              return false;
            }
            break;
          case 'function':
            // any function is fine at the moment
            break;
          default:
            print
                && console.error([ "obj[", key, "] = ", val,
                    ": invalid type: ", toType(val) ].join(''));
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
              print
                  && console.error([ "obj.[", key, "]: is not all caps" ]
                      .join(''));
              return false;
            }

            // check recursively for constant
            if (isConstant(obj[key]) === false) {
              print
                  && console.error([ "obj.[", key, "]: object is no constant" ]
                      .join(''));
              return false;
            }
          }

          // didn't return earlier, so obj must be a constant
          return true;
        case 'array':
          for (elem in obj) {
            elem = obj[elem];
            if (isConstant(elem) === false) {
              print
                  && console.error([ "obj.[", elem, "]: array is no constant" ]
                      .join(''));
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
          print && console.error([ "invalid type: ", totype(obj) ].join(''));
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
      function isInterface (intf) {
        var keys, key;

        keys = Object.keys(intf);

        // abort if there's no Interface key
        if (keys.indexOf('Interface') === -1) {
          print && console.error("intf.Interface: not found");
          return false;
        }

        // validate the interface object
        if (isInterfaceObject(intf.Interface) === false) {
          print
              && console.error([ "intf.Interface: is no interface object" ]
                  .join(''));
          return false;
        }

        for (key in keys) {
          key = keys[key];
          if (key === 'Interface') {
            continue;
          }

          // enforce all caps
          if (isCaps(key) === false) {
            print
                && console.error([ "intf.[", key, "]: is not all caps" ]
                    .join(''));
            return false;
          }

          // test for constant
          if (isConstant(intf[key]) === false) {
            print
                && console.error([ "intf.[", key, "]: is not constant" ]
                    .join(''));
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

          if (j < 0 || a[i] === b[j]) {
            obj.shared.push(a[i]);
            j -= 1;
          } else {
            out.a.push(a[i]);
          }
        }

        // reverse to order of first appearance
        out.a.reverse();
        out.b.reverse();

        return out;
      }

      /**
       * retrieve all keys of an object from itself, its prototype (if it's a
       * class) or the prototype if its class. Recursive.
       * 
       * @param {instance,
       *          class} obj the object or class
       * @returns {string array} an array of all referenced keys
       */
      function getObjectKeys (obj) {
        var out, isClass, isInstance;

        isClass = obj.prototype != undefined && toType(obj) === 'function';
        isInstance = obj.constructor != undefined && toType(obj) === 'object';

        if (isInstance) {
          out = Object.keys(obj);
          out = arrayUnique(out
              .concat(getObjectKeys(obj.constructor.prototype)));
        } else if (isClass) {
          if (obj === Object) {
            // base constructor reached
            out = [];
          } else {
            out = getObjectKeys(obj.prototype);
          }
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
       * @param{boolean} recurse match interfaces recursively
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

        // if interface keys are missing, abort with console.error
        if (diff.i.length !== 0) {
          print
              && console.error([ "match: missing keys in implementation: ",
                  diff.i.join(', ') ].join(''));
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
            print && console.error([ "extra keys: ", err.join(', ') ].join(''));
            return false;
          }
        }

        err = [];
        // match the types of each shared key
        for (tmp in diff.shared) {
          tmp = diff.shared[i];
          i = toType(intf.Interface[i]);
          j = toType(obj[i]);

          if (i === j) {
            // match sub-interface
            if (recurse && i === 'object') {
              if (matchInterface(intf.Interface[tmp], obj[tmp], noMoreFuncs,
                  noMoreMembers, recurse) !== true) {
                print
                    && console.error([ 'subinterface mismatch: ', i ].join(''));
                err.push([ tmp, ':', subintf ].join(''));
              }
            }
          } else {
            err.push([ tmp, ':', j, '!=', i ].join(''));
          }
        }

        if (err.length !== 0) {
          print && console.error([ "type mismatch:", err.join(', ') ].join(''));
          return false;
        }

        return true;
      }

      /**
       * Tests the implementation against the interface
       * 
       * opts string characters:
       * 
       * 'i' - also validate the interface using isInterface()
       * 
       * 'r' - check sub-interfaces recursively
       * 
       * '-' - disallow additional functions
       * 
       * '=' - disallow additional members, including functions
       * 
       * @param {Interface}
       *          intf The interface to match against
       * @param {object}
       *          obj the implementation
       * @param {string}
       *          opts string of option characters (see above)
       * @returns true if they match, false if they dont, undefined on other
       *          error
       */
      function match (intf, obj, opts) {
        var testIntf, noMoreFuncs, noMoreMembers, tmp, err, recurse;

        testIntf = noMoreFuncs = noMoreMembers = err = false;

        if (!intf) {
          print && console.error("missing interface to match against");
          err = true;
        }

        if (!obj && obj != {}) {
          print && console.error("missing object for matching");
          err = true;
        }

        opts = opts || "";

        tmp = ''; // stub to please jslint

        opts.split('');
        for (tmp in opts) {
          switch (tmp) {
          case 'i':
            testIntf = true;
            break;
          case 'r':
            recurse = true;
            break;
          case '=':
            noMoreMembers = true;
          case '-':
            noMoreFuncs = true;
            break;
          default:
            print
                && console.error([ 'unknown character in opts "', opts, '": ',
                    tmp ].join(''));
            err = true;
            break;
          }
        }

        if (err) {
          print && console.error('aborting on option parsing error');
          return undefined;
        }

        if (testIntf && (isInterface(intf) == false)) {
          print && console.error('match(): intf is no interface');
          return false;
        }

        return matchInterface(intf, obj, testClass, noMoreFuncs, noMoreMembers,
            recurse);
      }

      return {
        /**
         * Tests whether the Interface consists only of functions and other
         * interfaces
         * 
         * @param {Interface}
         *          intf A candidate for an interface
         * @returns {boolean} true if intf is an interface, false otherwise
         */
        isInterface : isInterface,

        /**
         * Tests the implementation against the interface
         * 
         * opts string characters:
         * 
         * 'i' - also validate the interface using isInterface()
         * 
         * 'p' - only check prototype functions. Useful for validating the whole
         * class instead of a single instance
         * 
         * '-' - disallow additional functions
         * 
         * '=' - disallow additional members, including functions
         * 
         * @param {Interface}
         *          intf The interface to match against
         * @param {object}
         *          obj the implementation
         * @param {string}
         *          opts string of option characters (see above)
         * @returns
         */
        match : match,

        verbose : function (isVerbose) {
          if (toType(isVerbose) === 'boolean') {
            print = isVerbose;
          } else {
            print
                && console
                    .error("Interface.verbose(): invalid input type: not boolean");
          }
        }
      };
    });