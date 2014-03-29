/**
 * Tournament is an interface for generalized management of tournaments. It
 * assumes unique player ids for every tournament, so the use of global ids is
 * encouraged.
 */
define([ './map', './ranking', './game', './blobber' ], function (Map, Ranking, Game, Blobber) {
  return {
    Interface : {
      /**
       * Add a player to the internal data structures such as maps and arrays.
       * the ids have to be unique
       * 
       * @param id
       *          unique external player id
       * @returns this if valid, undefined otherwise
       */
      addPlayer : function (id) {
        this.players.insert(id);
        // add player to the map and rescale all other
        return this;
      },

      /**
       * starts the tournament. This function might block the entry of new
       * players and is able to create the first valid list of open games
       * 
       * @returns a first array of open games (like getGames) if valid,
       *          undefined otherwise
       */
      start : function () {
        return this;
      },

      /**
       * ends the tournament, thereby creating the final result and invalidating
       * most functions
       * 
       * @returns this.getRanking() if valid, undefined otherwise
       */
      end : function () {
        return this.getRanking();
      },

      /**
       * apply the result of a running game. This function may manipulate the
       * list of games in any fashion, thereby generally invalidating the result
       * of the getGames() function.
       * 
       * @param game
       *          a running or applicable game
       * @param points
       *          array with points for every team (usually 2)
       * @returns this
       */
      finishGame : function (game, points) {
        return this;
      },

      /**
       * return an array of open games
       * 
       * @returns an array of open games
       */
      getGames : function () {
        return []; // Array of games
      },

      /**
       * return sorted ranking object including the global ids, actual place and
       * important points and (numeric) annotations in their own arrays
       * 
       * @returns the ranking
       */
      getRanking : function () {
        return {
          place : [], // actual place, usually [1, 2, 3, ...]. Necessary.
          ids : [], // sorted for ranking. Necessary
          mydata : [], // optional numerical data, e.g. points
          mydata2 : [], // same indices as place[] and ids[]
          mydata3 : 0, // single numerical values are fine, too
        };
      },

      /**
       * Check for changes in the ranking
       * 
       * @returns {boolean} true if the ranking changed, false otherwise
       */
      rankingChanged : function () {
        return true;
      },

      /**
       * Return the current state of the tournament
       * 
       * @returns {Integer} the current state. See Tournament.STATE
       */
      getState : function () {
        return -1;
      },

      /**
       * Incorporate a correction
       */
      correct : function () {
        return true;
      },

      /**
       * return all corrections
       * 
       * @returns an array of corrections
       */
      getCorrections : function () {
        return [];
      },

      /**
       * get an object with options
       * 
       * @returns an object containing tournament-specific options
       */
      getOptions : function () {
        return {};
      },

      /**
       * set options
       * 
       * @param {Object}
       *          options a modified options object retrieved from getOptions()
       * @returns true on success, false or undefined otherwise
       */
      setOptions : function (options) {
        return true;
      }

    },

    Extends : [ Blobber ],

    /**
     * Possible states of a tournament.
     */
    STATE : {
      PREPARING : 0,
      RUNNING : 1,
      FINISHED : 2,
      FAILURE : -1
    }
  };
});
