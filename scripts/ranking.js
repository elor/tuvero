/**
 * Ranking is an interface for different ranking methods.
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
      getSize : function () {
        return 0;
      },

      /**
       * getRanking() calculates the rankings and returns a sorted list of
       * player ids. Specific methods to get the values by which the ranking was
       * produced may still be implemented.
       * 
       * @returns sorted list of player ids
       */
      getRanking : function () {
        return [];
      },

      /**
       * addResult() adds a new game result to the internal storage methods.
       * 
       * @param {Result}
       *          result to add
       * @returns {Ranking} this
       */
      addResult : function (result) {
        return this;
      },

      /**
       * eraseResult() remove a game result from the storage. Optional method, but
       * useful in case of misentry.
       * 
       * @param {Result}
       *          result to erase
       * @returns {Ranking} this
       */
      eraseResult : function (result) {
        return this;
      },

      /**
       * correctResult() change the result of a previously added game to a new
       * state. This function should act linke erasing the old result and adding
       * the new one, but might encourage optimized algorithms.
       * 
       * @param {Result}
       *          oldresult
       * @param {Result}
       *          newresult
       * @returns {Ranking} this
       */
      correctResult : function (oldresult, newresult) {
        return this;
      }
    }
  };
});
