/**
 * Storage API for persistent state
 */
define([ 'options' ], function (Options) {
  var Storage, keys, Tab_Storage;

  Blob = undefined;
  Tab_Storage = undefined;

  Storage = {};
  keys = {};

  function saveKey (key) {
    var val, blob;

    // if (!keys.hasOwnProperty(key)) {
    // return true;
    // }

    val = keys[key];

    if (!val) {
      return true;
    }

    blob = val.toBlob();
    if (!blob) {
      return true;
    }

    window.localStorage.setItem(key, blob);

    return window.localStorage.getItem(key) !== blob;
  }

  function loadKey (key) {
    var val, blob;

    // if (!keys.hasOwnProperty(key)) {
    // return true;
    // }

    val = keys[key];

    if (!val) {
      console.error('localStorage.' + key + " doesn't exist");
      return true;
    }

    blob = window.localStorage.getItem(key);

    if (!blob) {
      return true;
    }

    try {
      val.fromBlob(blob);
    } catch (e) {
      console.error(e);
      return true;
    }
  }

  /**
   * remove this and only this key from localStorage to avoid collision with
   * other software under the same domain
   */
  Storage.clear = function () {
    var key;

    for (key in keys) {
      window.localStorage.removeItem(key);
    }
  };

  /**
   * store everything
   */
  Storage.store = function () {
    var key, val, err;

    err = false;

    for (key in keys) {
      if (saveKey(key)) {
        err = true;
        console.error('Error when storing ' + key);
      }
    }

    return !err;
  };

  /**
   * restore everything
   * 
   * @returns true on successful load, false otherwise
   */
  Storage.restore = function () {
    var key, err, blob;

    err = false;

    for (key in keys) {
      if (loadKey(key)) {
        err = true;
        console.error('Error when restoring ' + key);
      }
    }

    return !err;
  };

  /**
   * enables localStorage, if possible. Necessary initialization
   */
  Storage.enable = function () {

    Storage.disable();

    if (Modernizr.localstorage) {
      keys[Options.dbname] = require('./blob');
      keys[Options.dbplayername] = require('./players');
    }
  };

  /**
   * disables the storage. This will inhibit any of the other functions,
   * including clear(). Note that disable() doesn't clear the storage.
   */
  Storage.disable = function () {
    keys = {};
  };

  /**
   * this function indicates a change in the tournament state TODO move to Blob
   */
  Storage.changed = function () {
    if (Tab_Storage === undefined) {
      Tab_Storage = require('./tab_storage');
    }

    // invalidate
    Tab_Storage.reset();
    Storage.store();
  };

  return Storage;
});
