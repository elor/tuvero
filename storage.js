var Storage = (function() {
  if (!window.localStorage) {
    return {
      get: function(key) {},
      put: function(key, value) {},
      clear: function() {},
      available: false
    };
  };

  return {
    get: function(key, toItem, isNumeric) {
      var ret = window.localStorage.getItem(key);

      if (isNumeric) {
        ret = elorpack.unpack(ret);
      }
      if (toItem) {
        toItem.fromString(ret);
      }

      Toast(["'", key, "' restored"].join(''));

      return ret;
    },
    set: function(key, item, isNumeric) {
      var str = item.toString();
      if (str === undefined) {
        window.localStorage.removeItem(key);
        Toast(["'", key, "' removed"].join(''));
      } else {
        if (isNumeric) {
          str = elorpack.pack(str);
        }
        window.localStorage.setItem(key, str);
        Toast(["'", key, "' saved"].join(''));
      }

    },
    clear: function() {
      window.localStorage.clear();
    },
    available: true
  };
})();

