/**
 * KeyModel: Represents a key for use with Query, RefLog and Commit. Keys
 * contain a target, a startDate and a saveDate with millisecond-accuracy.
 *
 * Keys can be either root keys (startDate === saveDate), or child keys
 * (startDate < saveDate)
 *
 * This implementation tries to be as careful as possible with the formats to
 * avoid lost orphans, hence errors are thrown at the first sign of trouble.
 *
 * @return KeyModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/type', 'presets'], function(extend,
    Model, Type, Presets) {
  var delimiter, dateRegexSource, dateRegex, targetRegex, keyRegex, tuveroKeyRegex;

  /*
   * local regexes, which are used internally for format validation
   */
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
   * Constructor. Constructs a new key from the current target (Presets.target),
   * the given startDate and saveDate. The dates are checked for strict
   * ISO8601-compliance, including millisecond digits. The ECMA 5 standard
   * dictates that Date.prototype.toISOString() matches this format.
   *
   * @param startDate
   *          Any start date
   * @param saveDate
   *          Any save date. Must be later than startDate
   */
  function KeyModel(startDate, saveDate) {
    KeyModel.superconstructor.call(this);

    if (!dateRegex.test(startDate)) {
      throw new Error('startDate is no valid ISO8601. toISOString() failure?');
    }
    if (!dateRegex.test(saveDate)) {
      throw new Error('saveDate is no valid ISO8601. toISOString() failure?');
    }
    if (saveDate < startDate) {
      throw new Error('saveDate is earlier than startDate!');
    }

    this.target = Presets.target;
    this.startDate = startDate;
    this.saveDate = saveDate;

    if (!KeyModel.isValidKey(this)) {
      throw new Error(
          'Critical error: serialized key is not valid. Call Erik E. Lorenz!');
    }
  }
  extend(KeyModel, Model);

  /**
   * Converts the Key to a localStorage-compatible string representation.
   * Performs additional format checks.
   *
   * @return a localStorage-compatible string representation of the key
   */
  KeyModel.prototype.toString = function() {
    var key = [this.target, this.startDate, this.saveDate].join(delimiter);

    if (!keyRegex.test(key)) {
      throw new Error('created KeyModel does not match format: ' + key);
    }

    return key;
  };

  /**
   * Test whether the key is valid and a root key, i.e. both dates match
   *
   * @return true if valid and an root key, false otherwise
   */
  KeyModel.prototype.isRoot = function() {
    return this.startDate === this.saveDate;
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
    var relatedRegex;

    relatedRegex = new RegExp(targetRegex.source + '(' + this.startDate + ')'
        + delimiter + '(' + dateRegexSource + ')$', 'i');

    return relatedRegex.test(key.toString());
  };

  /**
   * @param key
   *          a key string or instance
   * @return true if both keys match, false otherwise
   */
  KeyModel.prototype.isEqual = function(key) {
    return this.toString() === key.toString();
  };

  /**
   * Test whether the given key is valid and can be processed by this target.
   * This does not test the stored content, only the key strings, so invalid
   * dates can still fall through.
   *
   * @param key
   *          a string representation of a key
   * @return true if key matches the key format and currently open target, false
   *         otherwise
   */
  KeyModel.isValidKey = function(key) {
    return keyRegex.test(key.toString());
  };

  /**
   * Test whether the date string is a compatible ISO8601-string.
   *
   * @param isoDateString
   *          a string representation of a date. Should be ISO8601 including
   *          milliseconds.
   * @return true if key matches the required date format. See
   *         Date.prototype.toISOString for more information
   */
  KeyModel.isValidDate = function(isoDateString) {
    return dateRegex.test(isoDateString);
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
    return tuveroKeyRegex.test(key.toString());
  };

  /**
   * create a new key which is related to the parent key (see isRelated()).
   * Apart from the key relation, no other parenting is applied.
   *
   * Extra care is taken when getting a new saveDate as to not accidentally
   * create the parentKey again. This could in theory happen if the childKey is
   * created less than a millisecond after the parentKey, but it's rather
   * unlikely in everyday use.
   *
   * NOTE: If the browser doesn't update the millisecond-portion of the Date,
   * this could potentially result in an infinite loop, or be stuck for a whole
   * second.
   *
   * @param parentKey
   *          a parent key
   * @return a new key with a later saveDate but the same startDate
   */
  KeyModel.createChild = function(parentKey) {
    var startDate, saveDate;

    if (!KeyModel.isValidKey(parentKey) || !Type.isObject(parentKey)) {
      throw new Error('createChild(): parentKey is not valid');
    }

    startDate = parentKey.startDate;

    /*
     * Avoid creating an identical key by accidentally having the exact same
     * millisecond-precise date. Stall code execution for a millisecond instead
     * to get a slightly different key. We could also modify the dates manually,
     * but a millisecond won't even be noticed.
     *
     * Normally, you don't create two keys that close to another, and even then
     * it's only max. 200 loop executions.
     */
    do {
      saveDate = (new Date()).toISOString();
    } while (saveDate === startDate);

    return new KeyModel(startDate, saveDate);
  };

  /**
   * read startDate and saveString from the keyString and make sure that the
   * targets match.
   *
   * @param keyString
   * @return a KeyModel instance with the extracted startDate and saveDate.
   */
  KeyModel.fromString = function(keyString) {
    var startDate, saveDate, matches;

    if (!targetRegex.test(keyString)) {
      throw new Error('KeyModel reference string has wrong target: '
          + keyString);
    }

    matches = keyRegex.exec(keyString);
    if (!matches) {
      throw new Error('KeyModel reference string does not match format');
    }
    if (matches.length !== 4) {
      throw new Error('Regex Error? wrong number of captures (not 3): '
          + matches.join(','));
    }

    startDate = matches[2];
    saveDate = matches[3];

    return new KeyModel(startDate, saveDate);
  };

  /**
   * create a new root key
   *
   * @return a new root key with the current date
   */
  KeyModel.createRoot = function() {
    var startDate = (new Date()).toISOString();

    return new KeyModel(startDate, startDate);
  };

  /**
   * a sort function for KeyModels. Sorts by target, startDate and saveDate, all
   * in ascending order.
   *
   * @param keyA
   * @param keyB
   * @return -1, 0 or 1, depending on the keys.
   */
  KeyModel.sortFunction = function(keyA, keyB) {
    return keyA.toString().localeCompare(keyB.toString());
  };

  return KeyModel;
});
