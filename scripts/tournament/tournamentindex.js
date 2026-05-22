/**
 * TournamentIndex: An object with which tournaments can be instantiated from
 * system strings, instead of knowing the constructor in advance.
 *
 * @return TournamentIndex;
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import Type from '../core/type.js';
import RoundTournamentModel from './roundtournamentmodel.js';
import SwissTournamentModel from './swisstournamentmodel.js';
import KOTournamentModel from './kotournamentmodel.js';
import PlacementTournamentModel from './placementtournamentmodel.js';
import PoulesTournamentModel from './poulestournamentmodel.js';
import FormuleXTournamentModel from './formulextournamentmodel.js';

const allTournamentModels = [
  RoundTournamentModel,
  SwissTournamentModel,
  KOTournamentModel,
  PlacementTournamentModel,
  PoulesTournamentModel,
  FormuleXTournamentModel
];

let TournamentIndex, tournamentSystems, i, sys;
tournamentSystems = {};
for (i = 0; i < allTournamentModels.length; i += 1) {
  sys = allTournamentModels[i].prototype.SYSTEM;
  if (tournamentSystems[sys]) {
    console.error('ERROR: duplicate tournament sys: ' + sys);
  }
  tournamentSystems[sys] = allTournamentModels[i];
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
  createTournament: function (system, rankingorder) {
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
export default TournamentIndex;