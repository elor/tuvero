/**
 * Ranking is an interface for different ranking methods.
 */
define(function () {
  return {
    Interface : {

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
       * addGame() adds a new game result to the internal storage methods.
       * 
       * @param {Result}
       *          result to add
       * @returns {Ranking} this
       */
      addGame : function (result) {
        return this;
      },

      /**
       * eraseGame() remove a game result from the storage. Optional method, but
       * useful in case of misentry.
       * 
       * @param {Result}
       *          result to erase
       * @returns {Ranking} this
       */
      eraseGame : function (result) {
        return this;
      },

      /**
       * correctGame() change the result of a previously added game to a new
       * state. This function should act linke erasing the old result and adding
       * the new one, but might encourage optimized algorithms.
       * 
       * @param {Result}
       *          oldresult
       * @param {Result}
       *          newresult
       * @returns {Ranking} this
       */
      correctGame : function (oldresult, newresult) {
        return this;
      }
    }
  };
});
