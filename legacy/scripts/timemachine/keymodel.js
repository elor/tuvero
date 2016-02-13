/**
 * KeyModel *
 *
 * @return KeyModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/type', 'presets'], function(extend,
    Model, Type, Presets) {
  var delimiter, dateRegexSource, dateRegex, keyRegex, tuveroKeyRegex;

  delimiter = '_';
  dateRegexSource = '[0-9]{4}-[0-9]{2}-[0-9]{2}'
      + 'T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z';
  dateRegex = new RegExp('^' + dateRegexSource + '$');
  targetRegex = new RegExp('^(' + Presets.target + ')' + delimiter);
  keyRegex = new RegExp(targetRegex.source + '(' + dateRegexSource + ')'
      + delimiter + '(' + dateRegexSource + ')$');
  tuveroKeyRegex = new RegExp('^([a-z]*)' + delimiter + '(' + dateRegexSource
      + ')' + delimiter + '(' + dateRegexSource + ')$');

  /**
   * Constructor. Either a root key (empty construction), a descendant of
   * another key (pass a KeyModel instance as parent) or a
   * representation (pass a key string to read all info from) *
   *
   * @param reference
   *          Leave empty to create a new key. KeyModel instance to
   *          create a child from, or a key string to create a representation
   *          from.
   */
  function KeyModel(reference) {
    var matches;
    KeyModel.superconstructor.call(this);

    this.saveDate = (new Date()).toISOString();
    this.startDate = this.saveDate;
    this.target = Presets.target;

    if (!dateRegex.test(this.saveDate)) {
      throw new Error('Date.toISOString() does not return valid ISO 8601.');
    }

    if (Type.isString(reference)) {
      if (!targetRegex.test(reference)) {
        throw new Error(
            'KeyModel reference string has wrong target: '
                + reference);
      }
      matches = keyRegex.exec(reference);
      if (!matches) {
        throw new Error(
            'KeyModel reference string does not match format');
      }
      if (matches.length != 4) {
        throw new Error('Regex Error? wrong number of captures (not 3): '
            + matches.join(','));
      }

      // this.target has already been set from Presets.
      this.startDate = matches[2];
      this.saveDate = matches[3];
    } else if (Type.isObject(reference)
        && reference instanceof KeyModel) {
      if (!dateRegex.test(reference.startDate)) {
        throw new Error(
            'referenced KeyModel startDate is no valid ISO 8601');
      }
      this.startDate = reference.startDate;
    } else if (reference !== undefined) {
      throw new Error('KeyModel(): invalid argument: ' + reference);
    }
  }
  extend(KeyModel, Model);

  // TODO test!
  KeyModel.construct = function(startDate, saveDate) {
    var str = [Presets.target, startDate, saveDate].join(delimiter);

    return new KeyModel(str);
  };

  /**
   * converts the the Key to a localStorage-compatible string representation *
   *
   * @return a localStorage-compatible string representation of the key
   */
  KeyModel.prototype.toString = function() {
    var key = [this.target, this.startDate, this.saveDate].join(delimiter);

    if (!keyRegex.test(key)) {
      throw new Error('created KeyModel does not match format: '
          + key);
    }

    return key;
  };

  /**
   * Test whether the given key is valid and can be processed by this target.
   * This does not test the stored content, only the key strings.
   *
   * @param key
   *          a string representation of a key
   * @return true if key matches the key format and currently open target, false
   *         otherwise
   */
  KeyModel.isValidKey = function(key) {
    if (Type.isObject(key)) {
      key = key.toString();
    }

    return keyRegex.test(key);
  };

  /**
   * Test whether the given key could in theory be used for another target
   * (Basic, Boule, TAC, ...)
   *
   * @param key
   *          a string representation of a key
   * @return true if key matches the tuvero key format, regardless of the target
   */
  KeyModel.isTuveroKey = function(key) {
    if (Type.isObject(key)) {
      key = key.toString();
    }

    return tuveroKeyRegex.test(key);
  };

  /**
   * Test whether a key is valid and an init key, i.e. both dates match
   *
   * @param key
   *          a key
   * @return true if valid and an init key, false otherwise
   */
  KeyModel.isInitKey = function(key) {
    if (!KeyModel.isValidKey(key)) {
      return false;
    }

    if (Type.isString(key)) {
      key = new KeyModel(key);
    }

    return key instanceof KeyModel && key.startDate
        && key.startDate == key.saveDate;
  };

  /**
   * Test whether the key is somehow related to this key, i.e. whether the start
   * date and target match. This does not test whether they're in the same
   * branch, since only the keys are tested, not their relations.
   *
   * If used as an Array.filter() function, you must use the bind() function!
   *
   * @param key
   * @return true if target and start date match, false otherwise.
   */
  KeyModel.prototype.isRelated = function(key) {
    if (Type.isObject(key)) {
      key = key.toString();
    }

    var relatedRegex = new RegExp(targetRegex.source + '(' + this.startDate
        + ')' + delimiter + '(' + dateRegexSource + ')$', 'i');

    return relatedRegex.test(key);
  };

  /**
   * @param key
   *          a key string or instance
   * @return true if both keys match, false otherwise
   */
  KeyModel.prototype.isEqual = function(key) {
    if (Type.isObject(key)) {
      key = key.toString();
    }

    return this.toString() == key.toString();
  };

  KeyModel.sortFunction = function(keyA, keyB) {
    return keyA.toString().localeCompare(keyB.toString());
  };

  return KeyModel;
});