/**
 * Tab Interface
 */

define([ './opts' ], function (Opts) {
  return {
    Interface : {
      /**
       * Reset to an empty state, usually the initial state
       * 
       * @returns {boolean} true on success, false on error
       */
      reset : function () {
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
    },

    Extends : [ Opts.Interface ]
  };
});