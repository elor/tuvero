/**
 * LegacyStorageKeyConverter: Convert old savestate keys from the localStorage
 * to the new TimeMachine/KeyModel keys
 *
 * @return LegacyStorageKeyConverter
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['timemachine/commitmodel', 'presets'], function(CommitModel, Presets) {
  var keyRegex = new RegExp('^' + Presets.target + 's?tournament$');

  /**
   * Constructor. Does nothing.
   */
  function LegacyStorageKeyConverter() {
  }

  /**
   * Find all legacy keys in the local storage for the current target and
   * convert them.
   */
  LegacyStorageKeyConverter.prototype.convertAll = function() {
    var allKeys, legacyKeys;

    if (window.localStorage) {
      allKeys = Object.keys(window.localStorage);
    } else {
      allKeys = [];
    }

    legacyKeys = allKeys.filter(keyRegex.test.bind(keyRegex));

    legacyKeys.forEach(this.convert.bind(this));
  };

  /**
   * move a single legacy key to the reflog if it is in the local storage and
   * contains data. No tests are performed for the fitness of the data itself.
   *
   * @param legacyKey
   *          e.g. 'boulestournament' or 'tactournament'
   * @return true on success, false otherwise
   */
  LegacyStorageKeyConverter.prototype.convert = function(legacyKey) {
    var storedString, commit;

    if (!legacyKey) {
      return true;
    }

    if (!window.localStorage) {
      return false;
    }

    storedString = window.localStorage[legacyKey];
    if (!storedString) {
      window.localStorage.removeItem(legacyKey);
      return true;
    }

    commit = CommitModel.createRoot(storedString, 'imported_' + legacyKey);

    if (commit && commit.isValid()) {
      localStorage.removeItem(legacyKey);
      return true;
    }

    return false;
  };

  return LegacyStorageKeyConverter;
});
