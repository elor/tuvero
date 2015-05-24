/**
 * TournamentIndex: An object with which tournaments can be instantiated from
 * system strings, instead of knowing the constructor in advance.
 *
 * @return TournamentIndex;
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./tournamentmodel'], function() {
  var TournamentIndex, tournamentSystems, i;

  tournamentSystems = {};
  for (i = 0; i < arguments.length; i += 1) {
    if (tournamentSystems[arguments[i].SYSTEM]) {
      console.error("ERROR: duplicate tournament system: "
          + arguments[i].SYSTEM);
    }
    tournamentSystems[arguments[i].SYSTEM] = arguments[i];
  }

  TournamentIndex = {
    createTournament: function(system, rankingorder) {
      if (tournamentSystems[system]) {
        return new TournamentModel(rankingorder);
      }

      console.error("TournamentIndex: system not found: " + system);
      return undefined;
    }
  };

  return TournamentIndex;
});