/**
 * Tournament is an interface for generalized management of tournaments. It
 * assumes unique player ids for every tournament, so the use of global ids is
 * encouraged.
 */
define([ 'map', 'ranking', 'game' ], function (Map, Ranking, Game) {
  return {
    Interface : {
      /**
       * internal map of players. This restriction might be unnecessary, but is
       * required by any ranking anyway, so yeah.
       */
      players : new Map(),

      /**
       * internal ranking of any kind, since tournaments are useless without
       */
      ranking : new Ranking(),

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
       * @returns a first array of open games (like openGames) if valid,
       *          undefined otherwise
       */
      start : function () {
        return this;
      },

      /**
       * ends the tournament, thereby creating the final result and invalidating
       * most functions
       * 
       * @returns this if valid, undefined otherwise
       */
      end : function () {
        return this.getRanking();
      },

      /**
       * apply the result of a running game. This function may manipulate the
       * list of games in any fashion, thereby generally invalidating the result
       * of the openGames() function.
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
      openGames : function () {
        return []; // Array of games
      },

      /**
       * return sorted ranking object including the global ids and important
       * points and (numeric) annotations (A/B/C-Tournament -> 1/2/3 and so on)
       * 
       * @returns the ranking
       */
      getRanking : function () {
        var res = this.ranking.get();

        // this line merely ensures jslint compatibility
        res.ranking = res.ranking || [];

        // *magic*

        return {
          ids : []
        };
      }
    }
  };
});
