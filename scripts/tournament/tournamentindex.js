/**
 * TournamentIndex: An object with which tournaments can be instantiated from
 * system strings, instead of knowing the constructor in advance.
 *
 * @return TournamentIndex;
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['core/type', 'tournament/roundtournamentmodel', 'tournament/swisstournamentmodel',
  'tournament/kotournamentmodel', 'tournament/placementtournamentmodel',
  'tournament/poulestournamentmodel'], function (Type) {
  var TournamentIndex, tournamentSystems, i, sys;

  tournamentSystems = {};
  // i starts at 1 to ignore the "Type" object
  for (i = 1; i < arguments.length; i += 1) {
    sys = arguments[i].prototype.SYSTEM;
    if (tournamentSystems[sys]) {
      console.error('ERROR: duplicate tournament sys: ' + sys);
    }
    tournamentSystems[sys] = arguments[i];
  }

  TournamentIndex = {
    /**
     * creates a tournament
     *
     * @param system
     *          a string which corresponds to a TournamentModel.SYSTEM string
     * @param rankingorder
     *          a ranking order
     * @return a TournamentModel instance on success, or undefined on failure
     *         (e.g. if the system doesn't exist)
     */
    createTournament: function(system, rankingorder) {
      if (Type.isString(system)) {
        // default instantiation by name
        if (tournamentSystems[system]) {
          return new tournamentSystems[system](rankingorder);
        }
      } else if (Type.isObject(system)) {
        // "restore"-instantiation from savedata
        return TournamentIndex.createTournament(system.sys);
      }

      console.error('TournamentIndex: system not found: ' + system);
      return undefined;
    },
    systems: Object.keys(tournamentSystems).sort()
  };

  return TournamentIndex;
});
