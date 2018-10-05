/**
 * PlacementTournamentModel
 *
 * @return PlacementTournamentModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "tournament/tournamentmodel", "core/matchmodel",
  "core/byeresult", "options"], function (extend,
    TournamentModel, MatchModel, ByeResult, Options) {

    /**
     * Constructor
     */
    function PlacementTournamentModel() {
      PlacementTournamentModel.superconstructor.call(this, ["placement", "wins"]);
    }
    extend(PlacementTournamentModel, TournamentModel);

    PlacementTournamentModel.prototype.SYSTEM = "placement";

    /**
     * create the initial matches for the registered teams
     *
     * @return true on success, false otherwise
     */
    PlacementTournamentModel.prototype.initialMatches = function () {
      var indices, teams, match, matchID;

      indices = this.teams.map(function (teamid, index) {
        return index;
      });

      matchID = 0;

      while (indices.length > 0) {
        teams = indices.splice(0, 2);

        if (teams[1] === undefined) {
          match = new ByeResult(teams[0], [Options.byepointswon,
          Options.byepointslost], matchID, 0);
          this.history.push(match);
        } else {
          match = new MatchModel(teams, matchID, 0);
          this.matches.push(match);
        }

        matchID += 1;
      }

      return true;
    };

    /**
     * should never be called since KO tournaments can't be idle, only finished
     */
    PlacementTournamentModel.prototype.idleMatches = function () {
      throw new Error("KO Tournaments cannot be in idle state."
        + " This function can never be called by the TournamentModel.");
    };

    PlacementTournamentModel.prototype.postprocessMatch = function (matchresult) {
      if (this.matches.length === 0) {
        this.state.set("finished");
      }
    };

    return PlacementTournamentModel;
  });
