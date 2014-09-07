/**
 * Storage API for persistent state
 */
define([ './options' ], function (Options) {
  var Storage, keys, Tab_Settings, savespending;

  Tab_Settings = undefined;

  Storage = {};
  keys = {};
  savespending = {};

  function saveKey (key) {
    var val, blob;

    // if (!keys.hasOwnProperty(key)) {
    // return true;
    // }

    val = keys[key];

    if (!val) {
      return true;
    }

    console.log('blobbing ' + key);
    blob = val.toBlob();
    if (!blob) {
      return true;
    }

    console.log('storing ' + key);
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
  Storage.clear = function (key) {

    if (key === undefined) {
      for (key in keys) {
        Storage.clear(key);
      }
    } else {
      if (keys[key]) {
        if (keys[key].reset) {
          keys[key].reset();
        }
        window.localStorage.removeItem(key);
      }
    }
  };

  /**
   * store everything
   */
  Storage.store = function () {
    var key, val, err;

    for (key in keys) {
      if (savespending[key] == true) {
      } else {
        savespending[key] = true;
        window.setTimeout(function (mykey) {
          if (saveKey(mykey)) {
            console.error('Error when storing ' + mykey);
          }
          savespending[mykey] = false;
        }, 1, key);
      }
    }

    return true;
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
        console.error("Could not read key '" + key + "' from localStorage (yet)");
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
      keys[Options.dbname] = require('./state');
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
    if (Tab_Settings === undefined) {
      Tab_Settings = require('./tab_settings');
    }

    // invalidate
    Tab_Settings.reset();
    Storage.store();
  };

  return Storage;
});
