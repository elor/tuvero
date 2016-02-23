/**
 * Query searches the localStorage for keys related to tuvero
 *
 * @return Query
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['timemachine/keymodel', 'core/type'], function(KeyModel, Type) {

  if (!window.localStorage) {
    throw new Error('No support for LocalStorage!');
  }

  /**
   * Constructor. Constructs a new query, but does not apply the filter. A query
   * reads the localStorage for entries, regardless of the RefLog.
   *
   * The reference can be a key, in which case only related keys are returned by
   * the filter() function, or one of the logical constants, i.e. one of
   * Query.ALLKEYS/ROOTKEYS/LASTKEYS/LATESTSAVE/ALLTUVEROKEYS.
   *
   * Query.ALLKEYS filters all keys for the current target
   *
   * Query.ROOTKEYS filters only the root keys
   *
   * Query.LASTKEYS filters the last saved keys for every root key
   *
   * Query.LATESTSAVE filters the single key with the highest save date
   *
   * Query.ALLTUVEROKEYS filters all keys of any possible target.
   *
   * @param reference
   *          a KeyModel instance/string (=> related keys) or one of the static
   *          members of Query (e.g. Query.ALLKEYS). Defaults to Query.ALLKEYS
   *
   */
  function Query(reference) {
    this.reference = reference;
    if (reference === Query.ALLKEYS) {
    } else if (reference === Query.ROOTKEYS) {
    } else if (reference === Query.LASTKEYS) {
    } else if (reference === Query.LATESTSAVE) {
    } else if (reference === Query.ALLTUVEROKEYS) {
    } else if (Type.isString(reference)) {
      this.referenceKey = KeyModel.fromString(reference);
    } else if (reference instanceof KeyModel) {
      this.referenceKey = reference;
    } else {
      throw new Error('Query: reference has unknown type: ' + reference);
    }
  }

  Query.ALLKEYS = undefined; // --> default behaviour
  Query.ROOTKEYS = {};
  Query.LASTKEYS = {};
  Query.LATESTSAVE = {};
  Query.ALLTUVEROKEYS = {};

  /**
   * reads the localStorage for valid keys and filters them by the given
   * reference. See Query() for a full list of possible references.
   *
   * You can apply filter() as often as you want. There is no caching involved.
   *
   * @return an array of stored key strings which match the selection
   */
  Query.prototype.filter = function() {
    var keys, trees, last, lastDate;
    keys = Object.keys(window.localStorage);

    if (this.reference === Query.ALLTUVEROKEYS) {
      keys = keys.filter(KeyModel.isTuveroKey);
    } else {
      keys = keys.filter(KeyModel.isValidKey);
    }

    if (keys.length === 0) {
      return [];
    }

    switch (this.reference) {
    case Query.ALLKEYS:
    case Query.ALLTUVEROKEYS:
      // Nothing to do here. keys already contains all keys.
      break;
    case Query.ROOTKEYS:
      keys = keys.filter(function(keyString) {
        var key = new KeyModel.fromString(keyString);
        return key.isRoot();
      });
      break;
    case Query.LASTKEYS:
      trees = {};
      keys.forEach(function(keyString) {
        var startDate = (KeyModel.fromString(keyString)).startDate;
        if (!trees[startDate] || trees[startDate] < keyString) {
          trees[startDate] = keyString;
        }
      });

      keys = Object.keys(trees).map(function(key) {
        return trees[key];
      });
      break;
    case Query.LATESTSAVE:
      last = undefined;
      keys.forEach(function(keyString) {
        var saveDate = (KeyModel.fromString(keyString)).saveDate;
        if (!last || lastDate < saveDate) {
          last = keyString;
          lastDate = saveDate;
        }
      });

      keys = [last];
      break;
    default:
      if (!this.referenceKey) {
        throw new Error('Query:'
            + ' this.referenceKey could not be extracted from this.reference');
      }

      keys = keys.filter(this.referenceKey.isRelated.bind(this.referenceKey));

      break;
    }

    return keys.sort();
  };

  return Query;
});
