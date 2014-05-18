/**
 * define, store, read and write options of arbitrary type
 * 
 * Undefined behavior (most likely infinite loops) on nesting loops
 */
define([], function () {
  var Interface, Options;

  Interface = {
    Interface : {
      /**
       * get an object which contains a copy of all options
       * 
       * @returns an object containing copies of the current options
       */
      getOptions : function () {
        return {};
      },

      /**
       * set options
       * 
       * @param options
       *          a modified options object retrieved from getOptions()
       * @returns true on success, false or undefined otherwise
       */
      setOptions : function (options) {
        return true;
      }
    },
  };

  /**
   * constructor
   * 
   * @returns {Options}
   */
  Options = function () {
    this.options = {};
  };

  /**
   * stores the current state in a blob, mostly using JSON (
   * 
   * @returns the blob
   */
  Options.prototype.toBlob = function () {
    return JSON.stringify(this.options);
  };

  /**
   * restores a state from the blob
   * 
   * @param blob
   *          the blob
   */
  Options.prototype.fromBlob = function (blob) {
    var ob = JSON.parse(blob);

    this.setOptions(ob);

    return this;
  };

  function toType (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  function copyStaticObject (obj) {
    var key, ret;

    switch (toType(obj)) {
    case 'object':
      ret = {};
      break;
    case 'array':
      ret = [];
      break;
    default:
      // this is no reference
      return obj;
    }

    for (key in obj) {
      ret[key] = copyStaticObject(obj[key]);
    }

    return ret;
  }

  Options.prototype.getOptions = function () {
    return copyStaticObject(this.options);
  };

  Options.prototype.setOptions = function (options) {
    var key;

    if (toType(options) !== 'object') {
      console.error('Options.setOptions: invalid argument type');
      return false;
    }

    for (key in options) {
      // ignore unknown keys
      if (typeof (this.options[key]) === undefined) {
        console.error('Options.setOptions: unknown key: ' + key);
        return false;
      }
    }

    // copy every option, not the whole object
    for (key in options) {
      // TODO at least compare the type
      this.options[key] = copyStaticObject(options[key]);
    }

    return true;
  };

  Options.Interface = Interface;

  return Options;
});

// TODO test and incorporate
