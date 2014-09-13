/**
 * GlobalRanking, an object to determine the global ranking for every player by
 * its current tournament id (lower has a higher rank) and its rank within the
 * tournament.
 * 
 * If two players are equally ranked, the lowest ID is first.
 */
define([ './tournaments', './team' ], function (Tournaments, Team) {
  var GlobalRanking, teamobjects, teamsset;

  function TeamObject (teamid, tournamentid, tournamentrank) {
    this.id = teamid;
    this.tournamentid = tournamentid;
    this.tournamentrank = tournamentrank;
  }

  function updateTeamObjects () {
    var tournamentid, numtournaments, tournamentranking, i, teamobjects, teamsset;

    teamobjects = [];
    teamsset = [];
    lowplayer = 0;

    numtournaments = Tournaments.numTournaments();

    for (tournamentid = 0; tournamentid < numtournaments; tournamentid += 1) {
      if (Tournaments.isRunning(tournamentid)) {
        tournamentranking = Tournaments.getTournament(tournamentid).getRanking();

        for (i = 0; i < tournamentranking.ids.length; i += 1) {
          teamobjects.push(new TeamObject(tournamentranking.ids[i], tournamentid, tournamentranking.place[i]));
          teamsset[tournamentranking.ids[i]] = true;
        }
      }
    }

    for (i = 0; i < Team.count(); i += 1) {
      if (!teamsset[i]) {
        teamobjects.push(new TeamObject(i, numtournaments + 1337, 0));
      }
    }

    function sortfunc (a, b) {
      return a.tournamentid - b.tournamentid || a.tournamentrank - b.tournamentrank;
    }

    function strictsortfunc (a, b) {
      var sfres;
      return sortfunc(a, b) || a.id - b.id;
    }

    teamobjects.sort(strictsortfunc);

    if (teamobjects[0]) {
      teamobjects[0].globalrank = 0;
      for (i = 1; i < teamobjects.length; i += 1) {
        if (sortfunc(teamobjects[i - 1], teamobjects[i]) === 0) {
          teamobjects[i].globalrank = teamobjects[i - 1].globalrank;
        } else {
          teamobjects[i].globalrank = i;
        }
      }
    }

    return teamobjects;
  }

  GlobalRanking = {
    get : updateTeamObjects,
  };

  return GlobalRanking;
});
