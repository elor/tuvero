/**
 * TournamentIndex: An object with which tournaments can be instantiated from
 * system strings, instead of knowing the constructor in advance.
 *
 * @return TournamentIndex;
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./type', './roundtournamentmodel'], function(Type) {
  var TournamentIndex, tournamentSystems, i, sys;

  tournamentSystems = {};
  for (i = 1; i < arguments.length; i += 1) {
    sys = arguments[i].prototype.SYSTEM;
    if (tournamentSystems[sys]) {
      console.error('ERROR: duplicate tournament sys: ' + sys);
    }
    tournamentSystems[sys] = arguments[i];
  }

  TournamentIndex = {
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
    }
  };

  return TournamentIndex;
});
