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
    put: function(key, value) {
      window.localStorage.setItem(key, value);
    },
    clear: function() {
      window.localStorage.clear();
    },
    available: true
  };
})();

