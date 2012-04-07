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
      window.localStorage.setItem(key, item.toString());
    },
    clear: function() {
      window.localStorage.clear();
    },
    available: true
  };
})();

