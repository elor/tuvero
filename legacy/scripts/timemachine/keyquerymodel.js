/**
 * KeyQueryModel: Search all stored keysfor keys that are related to
 * the given instance *
 *
 * @return KeyQueryModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'timemachine/keymodel', 'core/type'],//
function(extend, Model, KeyModel, Type) {

  if (!window.localStorage) {
    throw new Error('No support for LocalStorage!');
  }

  /**
   * Constructor
   *
   * @param reference
   *          a KeyModel instance/string (=> related keys) or one of
   *          KeyQueryModel.ALLKEYS/INITKEYS/LASTKEYS/LATESTSAVE
   */
  function KeyQueryModel(reference) {
    KeyQueryModel.superconstructor.call(this);

    this.reference = reference;
    if (reference === KeyQueryModel.ALLKEYS) {
    } else if (reference === KeyQueryModel.INITKEYS) {
    } else if (reference === KeyQueryModel.LASTKEYS) {
    } else if (reference === KeyQueryModel.LATESTSAVE) {
    } else if (reference === KeyQueryModel.ALLTUVEROKEYS) {
    } else if (Type.isString(reference)) {
      this.referenceKey = new KeyModel(reference);
    } else if (reference instanceof KeyModel) {
      this.referenceKey = reference;
    } else {
      throw new Error('KeyQueryModel: reference has unknown type: '
          + reference);
    }
  }
  extend(KeyQueryModel, Model);

  KeyQueryModel.ALLKEYS = undefined; // --> default behaviour
  KeyQueryModel.INITKEYS = {};
  KeyQueryModel.LASTKEYS = {};
  KeyQueryModel.LATESTSAVE = {};
  KeyQueryModel.ALLTUVEROKEYS = {};

  /**
   *
   * @return an array of keys in the database which match the selection
   */
  KeyQueryModel.prototype.filter = function() {
    var keys, trees, last, lastDate;
    keys = Object.keys(window.localStorage);
    if (this.reference === KeyQueryModel.ALLTUVEROKEYS) {
      keys = keys.filter(KeyModel.isTuveroKey)
    } else {
      keys = keys.filter(KeyModel.isValidKey)
    }

    if (keys.length === 0) {
      return [];
    }

    switch (this.reference) {
    case KeyQueryModel.ALLKEYS:
    case KeyQueryModel.ALLTUVEROKEYS:
      // Nothing to do here. keys already contains all keys.
      break;
    case KeyQueryModel.INITKEYS:
      keys = keys.filter(KeyModel.isInitKey);
      break;
    case KeyQueryModel.LASTKEYS:
      trees = {};
      keys.forEach(function(keyString) {
        var startDate = (new KeyModel(keyString)).startDate;
        if (!trees[startDate] || trees[startDate] < keyString) {
          trees[startDate] = keyString;
        }
      });

      keys = Object.keys(trees).map(function(key) {
        return trees[key];
      });
      break;
    case KeyQueryModel.LATESTSAVE:
      last = undefined;
      keys.forEach(function(keyString) {
        var saveDate = (new KeyModel(keyString)).saveDate;
        if (!last || lastDate < saveDate) {
          last = keyString;
          lastDate = saveDate;
        }
      });

      keys = [last];
      break;
    default:
      if (!this.referenceKey) {
        throw new Error('KeyQueryModel:'
            + ' this.referenceKey could not be extracted from this.reference');
      }

      keys = keys.filter(this.referenceKey.isRelated.bind(this.referenceKey));

      break;
    }

    return keys.sort();
  };

  return KeyQueryModel;
});
