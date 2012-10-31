/**
 * Storage API for persistent state
 */
var Storage = {
  /**
   * required interface for storage actions on items
   */
  Interface : {
    toBlob : function() {
      return "";
    },
  },

  /**
   * Tests for availability of the underlying Storage API
   * 
   * @returns {Boolean} whether the Storage is available
   */
  available : function() {
    // TODO check if you can really write and read the storage
    // I might use modernizr
    return !!window.localStorage;
  },

  /**
   * Clears all stored
   */
  clear : function() {
    window.localStorage.clear();
  },

  /**
   * removes the key from the database
   * 
   * @param key
   */
  remove : function(key) {
    window.localStorage.removeItem(key);
  },

  /**
   * write a key. If toBlob() returns undefined, the key is removed from the
   * database as a precaution.
   * 
   * @param key
   *          {String} key
   * @param item
   *          {Storage} item to write to the storage
   * @returns {Boolean} true if the key exists after writing; false otherwise
   */
  write : function(key, item) {
    var str = item.toBlob();
    if (str === undefined) {
      window.localStorage.removeItem(key);
      return false;
    } else {
      window.localStorage.setItem(key, str);
      return true;
    }
  },

  /**
   * reads and returns a string from the storage
   * 
   * @param key
   *          {String} key
   * @returns {String} value
   */
  read : function(key) {
    return window.localStorage.getItem("key");
  },
};
