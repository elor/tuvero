/**
 * TimeMachineKeyQueryModel: Search all stored keysfor keys that are related to
 * the given instance *
 *
 * @return TimeMachineKeyQueryModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'ui/timemachinekeymodel', 'core/type'],//
function(extend, Model, TimeMachineKeyModel, Type) {

  if (!window.localStorage) {
    throw new Error('No support for LocalStorage!');
  }

  /**
   * Constructor
   *
   * @param reference
   *          a TimeMachineKeyModel instance/string (=> related keys) or one of
   *          TimeMachineKeyQueryModel.ALLKEYS/INITKEYS/LASTKEYS/LATESTSAVE
   */
  function TimeMachineKeyQueryModel(reference) {
    TimeMachineKeyQueryModel.superconstructor.call(this);

    this.reference = reference;
    if (reference === TimeMachineKeyQueryModel.ALLKEYS) {
    } else if (reference === TimeMachineKeyQueryModel.INITKEYS) {
    } else if (reference === TimeMachineKeyQueryModel.LASTKEYS) {
    } else if (reference === TimeMachineKeyQueryModel.LATESTSAVE) {
    } else if (reference === TimeMachineKeyQueryModel.ALLTUVEROKEYS) {
    } else if (Type.isString(reference)) {
      this.referenceKey = new TimeMachineKeyModel(reference);
    } else if (reference instanceof TimeMachineKeyModel) {
      this.referenceKey = reference;
    } else {
      throw new Error('TimeMachineKeyQueryModel: reference has unknown type: '
          + reference);
    }
  }
  extend(TimeMachineKeyQueryModel, Model);

  TimeMachineKeyQueryModel.ALLKEYS = undefined; // --> default behaviour
  TimeMachineKeyQueryModel.INITKEYS = {};
  TimeMachineKeyQueryModel.LASTKEYS = {};
  TimeMachineKeyQueryModel.LATESTSAVE = {};
  TimeMachineKeyQueryModel.ALLTUVEROKEYS = {};

  /**
   *
   * @return an array of keys in the database which match the selection
   */
  TimeMachineKeyQueryModel.prototype.filter = function() {
    var keys, trees, last, lastDate;
    keys = Object.keys(window.localStorage);
    if (this.reference === TimeMachineKeyQueryModel.ALLTUVEROKEYS) {
      keys = keys.filter(TimeMachineKeyModel.isTuveroKey)
    } else {
      keys = keys.filter(TimeMachineKeyModel.isValidKey)
    }

    if (keys.length === 0) {
      return [];
    }

    switch (this.reference) {
    case TimeMachineKeyQueryModel.ALLKEYS:
    case TimeMachineKeyQueryModel.ALLTUVEROKEYS:
      // Nothing to do here. keys already contains all keys.
      break;
    case TimeMachineKeyQueryModel.INITKEYS:
      keys = keys.filter(TimeMachineKeyModel.isInitKey);
      break;
    case TimeMachineKeyQueryModel.LASTKEYS:
      trees = {};
      keys.forEach(function(keyString) {
        var startDate = (new TimeMachineKeyModel(keyString)).startDate;
        if (!trees[startDate] || trees[startDate] < keyString) {
          trees[startDate] = keyString;
        }
      });

      keys = Object.keys(trees).map(function(key) {
        return trees[key];
      });
      break;
    case TimeMachineKeyQueryModel.LATESTSAVE:
      last = undefined;
      keys.forEach(function(keyString) {
        var saveDate = (new TimeMachineKeyModel(keyString)).saveDate;
        if (!last || lastDate < saveDate) {
          last = keyString;
          lastDate = saveDate;
        }
      });

      keys = [last];
      break;
    default:
      if (!this.referenceKey) {
        throw new Error('TimeMachineKeyQueryModel:'
            + ' this.referenceKey could not be extracted from this.reference');
      }

      keys = keys.filter(this.referenceKey.isRelated.bind(this.referenceKey));

      break;
    }

    return keys.sort();
  };

  return TimeMachineKeyQueryModel;
});
