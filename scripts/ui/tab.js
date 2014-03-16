/**
 * Tab Interface
 */

define([], function () {
  return {
    Interface : {
      /**
       * Reset to an empty state, usually the initial state
       * 
       * @returns {boolean} true on success, false on error
       */
      clear : function () {
        return true;
      },
      /**
       * Update everything to the current overall state
       * 
       * @returns {boolean} true on success, false on error
       */
      update : function () {
        return true;
      },
    }
  };
});