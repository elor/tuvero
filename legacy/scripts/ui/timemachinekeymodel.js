/**
 * TimeMachineKeyModel
 *
 * @return TimeMachineKeyModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/type', 'presets'], function(extend,
    Model, Type, Presets) {
  var delimiter, dateRegexSource, dateRegex, keyRegex;

  delimiter = '_';
  dateRegexSource = '[0-9]{4}-[0-9]{2}-[0-9]{2}'
      + 'T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z';
  dateRegex = new RegExp('^' + dateRegexSource + '$', 'i');
  targetRegex = new RegExp('^(' + Presets.target + ')' + delimiter, 'i');
  keyRegex = new RegExp(targetRegex.source + '(' + dateRegexSource + ')'
      + delimiter + '(' + dateRegexSource + ')$', 'i');

  /**
   * Constructor. Either a root key (empty construction), a descendant of
   * another key (pass a TimeMachineKeyModel instance as parent) or a
   * representation (pass a key string to read all info from)
   *
   * @param reference
   *          Leave empty to create a new key. TimeMachineKeyModel instance to
   *          create a child from, or a key string to create a representation
   *          from.
   */
  function TimeMachineKeyModel(reference) {
    var matches;
    TimeMachineKeyModel.superconstructor.call(this);

    this.nowDate = (new Date()).toISOString();
    this.startDate = this.nowDate;
    this.target = Presets.target;

    if (!dateRegex.test(this.nowDate)) {
      throw new Error('Date.toISOString() does not return valid ISO 8601.');
    }

    if (Type.isString(reference)) {
      if (!targetRegex.test(reference)) {
        throw new Error(
            'TimeMachineKeyModel reference string has wrong target: '
                + reference);
      }
      matches = keyRegex.exec(reference);
      if (!matches) {
        throw new Error(
            'TimeMachineKeyModel reference string does not match format');
      }
      if (matches.length != 3) {
        throw new Error('Regex Error? wrong number of matches (not 3): '
            + matches.join(','));
      }

      // this.target has already been set from Presets.
      this.startDate = matches[1];
      this.saveDate = matches[2];
    } else if (Type.isObject(reference)
        && reference instanceof TimeMachineKeyModel) {
      if (!dateRegex.test(reference.startDate)) {
        throw new Error(
            'referenced TimeMachineKeyModel startDate is no valid ISO 8601');
      }
      this.startDate = reference.startDate;
    } else if (reference !== undefined) {
      throw new Error('TimeMachineKeyModel(): invalid argument: ' + reference);
    }
  }
  extend(TimeMachineKeyModel, Model);

  /**
   * converts the the Key to a localStorage-compatible string representation
   *
   * @return a localStorage-compatible string representation of the key
   */
  TimeMachineKeyModel.prototype.toString = function() {
    var key = [this.target, this.startDate, this.nowDate].join(delimiter);

    if (!keyRegex.test(key)) {
      throw new Error('created TimeMachineKeyModel does not match format: '
          + key);
    }

    return key;
  };

  return TimeMachineKeyModel;
});
