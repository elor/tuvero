/**
 * TimeMachineModel
 *
 * TODO TEST!
 *
 * @return TimeMachineModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'presets'], //
function(extend, Model, Presets) {
  var delimiter, isoRE, keyRE, isoRESource, reflogKey;

  delimiter = '_';
  isoRESource = '[0-9]{4}-[0-9]{2}-[0-9]{2}'
      + 'T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z';
  isoRE = new RegExp('^' + isoRESource + '$', 'i');
  keyRE = new RegExp('^' + Presets.target + "(" + delimiter + isoRESource
      + "){2}$", "i");
  reflogKey = Presets.target + '-states';

  /**
   * Constructor
   */
  function TimeMachineModel() {
    TimeMachineModel.superconstructor.call(this);
  }
  extend(TimeMachineModel, Model);

  /**
   * creates a key-compatible ISO 8601 representation of the current time and
   * date.
   *
   * @return the current date as an ISO 8601-formatted string, including
   *         milliseconds. See isoRESource constant for the exact format
   */
  TimeMachineModel.prototype.now = function() {
    var nowString = (new Date()).toISOString();

    if (!isoRE.test(nowString)) {
      throw new Error('toISOString() does not conform to ISO 8601: '
          + nowString);
    }

    return nowString;
  };

  /**
   * @return an initial key in the format "{target}_{now}_{now}"
   */
  TimeMachineModel.prototype.initKey = function() {
    var nowString, key;

    nowString = this.now();
    key = Presets.target + delimiter + nowString + delimiter + nowString;

    return key;
  };

  /**
   * creates a storage key from the current millisecond-date
   *
   * @param parentKey
   *          a parent key
   * @return a storage key in the format "{target}_{startDate}_{now}"
   */
  TimeMachineModel.prototype.generateKey = function(parentKey) {
    var nowString, startString;

    nowString = this.now();
    startString = this.extractDates(parentKey)[0];

    key = Presets.target + delimiter + startString + delimiter + nowString;

    if (!keyRE.test(key)) {
      throw new Error('freshly generated key does not conform to Key format: '
          + key);
    }

    return key;
  };

  /**
   * retrieve an array of length 2, containing the startDate and saveDate, in
   * that order
   *
   * @param key
   *          a key
   * @return [startDate, saveDate]
   */
  TimeMachineModel.prototype.extractDates = function(key) {
    var matches;

    if (!keyRE.test(key)) {
      throw new Error('key does not match Key format: ' + key);
    }

    matches = key.split(delimiter).filter(isoRE.test.bind(isoRE));

    if (matches.length != 2) {
      throw new Error('key does not contain exactly 2 ');
    }

    return matches;
  };

  /**
   * @return an array of stored keys, which can be opened by the currently used
   *         build target
   */
  TimeMachineModel.prototype.allKeys = function() {
    return Object.keys(window.localStorage).filter(keyRE.test.bind(keyRE));
  };

  /**
   * @param key
   *          a valid key
   * @return an array of all stored keys, which share the same start date
   */
  TimeMachineModel.prototype.relatedKeys = function(key) {
    var re = new RegExp('^' + Presets.target + delimiter
        + this.extractDates(key)[0] + delimiter + isoRESource + '$', 'i');

    return this.allKeys().filter(re.test.bind(re));
  };

  /**
   * stores the given state under a fresh key as the root of a new tree
   *
   * @param state
   *          the string to save
   * @return the generated key
   */
  TimeMachineModel.prototype.init = function(state) {
    var key = this.initKey();

    // TODO delete old states

    localStorage[key] = state;

    return key;
  };

  /**
   * stores te given state under a key, which is a descendant of parentKey
   *
   * @param state
   *          the string to save
   * @param parentKey
   *          the key of any parent in the same tree
   *
   * @return the generated key
   */
  TimeMachineModel.prototype.save = function(state, parentKey) {
    var key = this.generateKey(parentKey);

    // TODO delete old states

    localStorage[key] = state;

    return key;
  };

  return TimeMachineModel;
});
