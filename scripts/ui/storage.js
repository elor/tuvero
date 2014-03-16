/**
 * Storage API for persistent state
 */
define(function () {
  var Storage, key, Blob, Tab_Storage;

  Blob = undefined;
  Tab_Storage = undefined;
  key = 'swiss';

  Storage = {
    /**
     * remove this and only this key from localStorage to avoid collision with
     * other software under the same domain
     */
    clear : function () {
      if (Blob) {
        window.localStorage.removeItem(key);
      }
    },

    /**
     * store the blob
     */
    store : function () {
      var blob;

      if (!Blob) {
        return undefined;
      }

      blob = Blob.toBlob();

      if (!blob) {
        return undefined;
      }

      window.localStorage.setItem(key, blob);
      return window.localStorage.getItem(key) === blob;
    },

    /**
     * restore from blob
     * 
     * @returns true on successful load, undefined otherwise
     */
    restore : function () {
      var blob;

      if (!Blob) {
        return undefined;
      }

      blob = window.localStorage.getItem(key);

      if (!blob) {
        return undefined;
      }

      try {
        Blob.fromBlob(blob);
      } catch (e) {
        console.error(e);
        return undefined;
      }

      return true;
    },

    /**
     * enables localStorage, if possible. Necessary initialization
     */
    enable : function () {
      if (Modernizr.localstorage) {
        Blob = require('./blob');
      } else {
        Blob = undefined;
      }
    },

    /**
     * disables the storage. This will inhibit any of the other functions,
     * including clear(). Note that disable() doesn't clear the storage.
     */
    disable : function () {
      Blob = undefined;
    }
  };

  /**
   * this function indicates a change in the tournament state
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
