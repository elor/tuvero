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
 * TODO: return or print an error message
 */

define(
    [ '../lib/toType' ],
    function (toType) { // TODO: toType path?
      var Example, isInterfaceObject, isInterface, isConstant, isCaps, print;

      print = false;

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
      isInterfaceObject = function (obj) {
        var keys, val;

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
      };

      /**
       * test whether a string is all caps
       * 
       * @param {String}
       *          str the string to test
       * @returns true if str is all caps, false otherwise
       */
      isCaps = function (str) {
        return /^[A-Z]+$/.test(str);
      };

      /**
       * test recursively whether the object is a constant
       * 
       * TODO: catch nesting loop
       * 
       * @param {Object}
       *          obj the object to test
       * @returns {boolean} true if obj is constant, false otherwise
       */
      isConstant = function (obj) {
        var keys;

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
                  && console.error([ "obj.[", key, "]: array is no constant" ]
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
          return true;
        default:
          print && console.error([ "invalid type: ", totype(obj) ].join(''));
          return false;
        }
      };

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
      isInterface = function (intf) {
        var keys;

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
      };

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