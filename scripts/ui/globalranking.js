/**
 * GlobalRanking, an object to determine the global ranking for every player by
 * its current tournament id (lower has a higher rank) and its rank within the
 * tournament.
 * 
 * If two players are equally ranked, the lowest ID is first.
 */
define([ './tournaments', './team' ], function (Tournaments, Team) {
  var GlobalRanking, teamobjects, teamsset;

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
    var i, tournamentid, numtournaments, teamid;

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
    var ranking, i;

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
      ranking[0].globalrank = 0;

      for (i = 1; i < ranking.length; i += 1) {
        if (sortfunc(ranking[i - 1], ranking[i]) === 0) {
          ranking[i].globalrank = ranking[i - 1].globalrank;
        } else {
          ranking[i].globalrank = i;
        }
      }
    }

    return ranking;
  }

  GlobalRanking = {
    get : updateTeamObjects,
  };

  return GlobalRanking;
});
