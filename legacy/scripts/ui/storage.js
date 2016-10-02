/**
 * Storage object, saves simple stuff, like the player names
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['presets', 'core/valuemodel', 'ui/autocompletionlegacyblobber'], //
function(Presets, ValueModel, AutoCompletionLegacyBlobber) {
  var Storage, keys;

  Storage = {};
  keys = {};
  keys[Presets.names.dbplayername] = AutoCompletionLegacyBlobber;

  /**
   * save a key to localStorage
   *
   * @param key
   *          the name of a key to save. Must be in the keys object
   * @return true on failure, false otherwise
   */
  function saveKey(key) {
    var val, blob;

    if (!window.localStorage) {
      return true;
    }

    if (!keys[key]) {
      return true;
    }

    blob = keys[key].toBlob();
    if (!blob) {
      return true;
    }

    console.log('storing ' + key);
    window.localStorage.setItem(key, blob);

    return window.localStorage.getItem(key) !== blob;
  }

  function loadKey(key) {
    var blob;

    if (!window.localStorage) {
      console.error('localStorage not available');
      return true;
    }

    if (!keys[key]) {
      console.error('localStorage.' + key + " doesn't exist");
      return true;
    }

    blob = window.localStorage.getItem(key);
    keys[key].fromBlob(blob || '');
    return !blob;
  }

  /**
   * remove this and only this key from localStorage to avoid collision with
   * other software under the same domain.
   *
   * @param key
   *          The key to remove from localStorage. if undefined, clear every key
   *          in the keys object
   */
  Storage.clear = function(key) {
    if (!window.localStorage) {
      return;
    }

    if (key === undefined) {
      Object.keys(keys).forEach(Storage.clear.bind(Storage));
    } else if (keys[key]) {
      if (keys[key].reset) {
        keys[key].reset();
      }
      window.localStorage.removeItem(key);
    }
  };

  /**
   * store everything
   */
  Storage.store = function() {
    Object.keys(keys).forEach(function(key) {
      if (saveKey(key)) {
        console.error('Error when storing ' + key);
      }
    });

    return true;
  };

  /**
   * restore everything
   *
   * @return true on successful load, false otherwise
   */
  Storage.restore = function() {
    var err = false;

    Object.keys(keys).forEach(function(key) {
      err = loadKey(key) || err;
    });

    return !err;
  };

  return Storage;
});
