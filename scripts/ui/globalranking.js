/**
 * GlobalRanking, an object to determine the global ranking for every player by
 * its current tournament id and its rank within the tournament.
 * 
 * If two players are equally ranked, the lowest ID is first.
 * 
 * @exports GlobalRanking
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ './tournaments', './team', './shared'], function (Tournaments, Team, Shared) {
  var GlobalRanking;

  function mapTeamsToTournamentIDs () {
    var tournamentorder, teams, i, tournamentid;

    teams = [];

    tournamentorder = Tournaments.getRankingOrder();

    while (teams.length < Team.count()) {
      i = teams.length;
      teams.push({
        rankoftournament : Tournaments.numTournaments(),
        tournamentid : undefined,
        teamid : i,
      });
    }

    for (i = tournamentorder.length - 1; i >= 0; i -= 1) {
      tournamentid = tournamentorder[i];
      Tournaments.getTeams(tournamentid).map(function (teamid) {
        teams[teamid] = {
          rankoftournament : i,
          tournamentid : tournamentid,
          teamid : teamid,
        };
      });
    }

    return teams;
  }

  function mapTeamsToTournamentRanks (teamtournaments) {
    var i, tournamentid, numtournaments, teamid, tournamentranking;

    numtournaments = Tournaments.numTournaments();

    for (tournamentid = 0; tournamentid < numtournaments; tournamentid += 1) {
      tournamentranking = Tournaments.getRanking(tournamentid);

      for (i = 0; i < tournamentranking.ids.length; i += 1) {
        teamid = tournamentranking.ids[i];

        if (teamtournaments[teamid].tournamentid === tournamentid) {
          teamtournaments[teamid].tournamentrank = tournamentranking.place[i];
        }
      }
    }

    return teamtournaments;
  }

  function updateTeamObjects () {
    var ranking, i, tournamentid;

    function sortfunc (a, b) {
      return a.rankoftournament - b.rankoftournament || a.tournamentrank - b.tournamentrank;
    }

    function strictsortfunc (a, b) {
      return sortfunc(a, b) || a.teamid - b.teamid;
    }

    ranking = mapTeamsToTournamentIDs();
    ranking = mapTeamsToTournamentRanks(ranking);

    ranking.sort(strictsortfunc);

    if (ranking[0]) {
      tournamentid = ranking[0].tournamentid;

      for (i = 0; i < ranking.length; i += 1) {
        if (tournamentid !== ranking[i].tournamentid || ranking[i].tournamentid === undefined) {
          tournamentid = ranking[i].tournamentid;
          ranking[i].globalrank = i;
        } else {
          if (i > 0 && (ranking[i].tournamentrank || 0) === (ranking[i - 1].tournamentrank || 0)) {
            ranking[i].globalrank = ranking[i - 1].globalrank;
          } else {
            ranking[i].globalrank = i;
          }
        }
      }
    }

    return ranking;
  }

  GlobalRanking = {
    get : updateTeamObjects,
  };

  Shared.GlobalRanking = GlobalRanking;
  return GlobalRanking;
});
