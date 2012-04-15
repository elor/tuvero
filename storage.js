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
    get: function(key) {
      return window.localStorage.getItem(key);
    },
    set: function(key, item) {
      var str = item.toString();
      if (str === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, str);
      }
    },
    clear: function() {
      window.localStorage.clear();
    },
    available: true
  };
})();

