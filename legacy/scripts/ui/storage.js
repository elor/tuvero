/**
 * Storage object, which binds storage keys to actual objects for storage and
 * retrieval from a local storage
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['options', 'lib/modernizr', 'core/valuemodel'], function(Options,
    Modernizr, ValueModel) {
  var Storage, keys, savespending;

  Storage = {};
  keys = {};
  savespending = {};

  Storage.lastSaved = new ValueModel(undefined);

  function saveKey(key) {
    var val, blob;

    // if (!keys.hasOwnProperty(key)) {
    // return true;
    // }

    val = keys[key];

    if (!val) {
      return true;
    }

    // console.log('blobbing ' + key);
    blob = val.toBlob();
    if (!blob) {
      return true;
    }

    console.log('storing ' + key);
    window.localStorage.setItem(key, blob);

    return window.localStorage.getItem(key) !== blob;
  }

  function loadKey(key) {
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
      val.fromBlob('');
      return true;
    }

    val.fromBlob(blob);
  }

  /**
   * remove this and only this key from localStorage to avoid collision with
   * other software under the same domain
   */
  Storage.clear = function(key) {

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
  Storage.store = function() {
    var key, date, datestring;

    for (key in keys) {
      if (savespending[key] !== true) {
        savespending[key] = true;
        window.setTimeout(function(mykey) {
          if (saveKey(mykey)) {
            console.error('Error when storing ' + mykey);
          }
          savespending[mykey] = false;
        }, 1, key);
      }
    }

    date = new Date();
    datestring = '';
    datestring += date.getFullYear();
    datestring += '-';
    datestring += (date.getMonth() + 1).toString().replace(/^(.)$/, '0$1');
    datestring += '-';
    datestring += date.getDate().toString().replace(/^(.)$/, '0$1');
    datestring += ' ';
    datestring += date.getHours().toString().replace(/^(.)$/, '0$1');
    datestring += ':';
    datestring += date.getMinutes().toString().replace(/^(.)$/, '0$1');
    datestring += ':';
    datestring += date.getSeconds().toString().replace(/^(.)$/, '0$1');
    Storage.lastSaved.set(datestring);

    return true;
  };

  /**
   * restore everything
   *
   * @return true on successful load, false otherwise
   */
  Storage.restore = function() {
    var key, err;

    err = false;

    for (key in keys) {
      if (loadKey(key)) {
        err = true;
        console.warn("Could not read key '" + key + "' from localStorage yet");
      }
    }

    return !err;
  };

  /**
   * enables localStorage, if possible. Necessary initialization
   */
  Storage.enable = function() {

    Storage.disable();

    if (Modernizr.localstorage) {
      keys[Options.dbname] = require('ui/state');
      keys[Options.dbplayername] = require('ui/players');
    }
  };

  /**
   * disables the storage. This will inhibit any of the other functions,
   * including clear(). Note that disable() doesn't clear the storage.
   */
  Storage.disable = function() {
    keys = {};
  };

  /**
   * this function indicates a change in the tournament state
   */
  // TODO move to Blob
  Storage.changed = function() {

    Storage.store();
  };

  return Storage;
});
