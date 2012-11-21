/**
 * Ranking is an interface for different ranking methods. The most important
 * assumption is about the player ids: They're required to be tight-packed
 * integer values starting at 0.
 * 
 */
define(function () {
  return {
    Interface : {
      /**
       * Retrieve the size of the internal data structures. This is required to
       * correspond to the number of players, the largest player id + 1 and the
       * size of returned arrays. Not that there's no setSize method.
       * 
       * @returns the size of the ranking
       */
      size : function () {
        return 0;
      },

      /**
       * Set a certain size. If it shrinks from the current size, older values
       * are expected to be discarded.
       * 
       * @param size
       *          the new size
       * @returns this
       */
      resize : function (size) {
        return this;
      },

      /**
       * get() calculates the rankings and returns a sorted list of player ids.
       * Specific methods to get the values by which the ranking was produced
       * may still be implemented. CAUTION: The returned object may (and most
       * likely will) contain references to internal data structures, so be
       * careful when editing them. Consider them readonly and all's fine
       * 
       * @returns an object containing the ranking as well as and
       *          implementation-specific data which was used for ranking.
       */
      get : function () {
        return {
          ranking : []
        };
      },

      /**
       * add() adds a new game result to the internal storage methods.
       * 
       * @param {Result}
       *          result to add
       * @returns {Ranking} this
       */
      add : function (result) {
        return this;
      },

      /**
       * remove() removes a game result from the storage. Optional method,
       * but useful in case of misentry.
       * 
       * @param {Result}
       *          result to erase
       * @returns {Ranking} this
       */
      remove : function (result) {
        return this;
      },

      /**
       * correct() changes the result of a previously added game to a new
       * state. This function should act linke erasing the old result and adding
       * the new one, but might encourage optimized algorithms.
       * 
       * @param {Result}
       *          oldresult
       * @param {Result}
       *          newresult
       * @returns {Ranking} this
       */
      correct : function (oldresult, newresult) {
        return this;
      }
    }
  };
});
