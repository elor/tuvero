/**
 * Tournaments is a list of _running_ tournaments, with null entries for
 * finished tournaments, but still keeping name and type information
 */
define([ '../backend/swisstournament' ], function (Swisstournament) {
  var Tournaments, tournaments, globalranking;

  Tournaments = {};
  tournaments = [];

  function createTournament (type, blob) {
    var tournament;

    tournament = undefined;
    if (!type) {
      return undefined;
    }

    switch (type) {
    case 'swiss':
      tournament = new Swisstournament();
      break;
    case 'ko':
      console.log(type + ' tournament type coming soon');
      break;
    default:
      console.error('undefined tournament type: ' + type);
      break;
    }

    if (blob) {
      tournament.fromBlob(blob);
    }

    return tournament;
  }

  Tournaments.addTournament = function (type, numteams, startteam) {
    var newtournament, i, teams;

    teams = [];

    newtournament = createTournament(type);

    if (!newtournament) {
      return undefined;
    }

    globalranking = require('./globalranking').get();

    if (globalranking.length > startteam + numteams) {
      console.error('you want too many teams in your tournament');
      return undefined;
    }

    console.log(numteams);
    for (i = 0; i < numteams; i += 1) {
      teams.push(globalranking[i + startteam].id);
      newtournament.addPlayer(globalranking[i + startteam].id);
    }

    tournaments.push({
      name : type,
      type : type,
      tournament : newtournament,
      teams : teams,
      finalranking : undefined,
    });

    return newtournament;
  };

  Tournaments.removeTournament = function (tournamentid) {
    var tournament;

    tournament = tournaments[tournamentid];
    if (!tournament) {
      console.error('tournament already removed?');
      return undefined;
    }

    tournaments[tournamentid].finalranking = tournament.getRanking();
    tournaments[tournamentid].tournament = undefined;

    return true;
  };

  Tournaments.numTournaments = function () {
    return tournaments.length;
  };

  Tournaments.setName = function (id, name) {
    tournaments[id].name = name;
  };

  Tournaments.getName = function (id) {
    return tournaments[id].name;
  };

  Tournaments.getTeams = function (id) {
    return tournaments[id].teams;
  };

  Tournaments.getRanking = function (tournamentid) {
    var tournament;

    if (!tournaments[i]) {
      console.error('tournamentid doesnt exist: ' + tournamentid);
      return undefined;
    }

    tournament = tournaments[i];

    return (tournament.tournament && tournament.tournament.getRanking()) || tournament.finalranking;
  };

  Tournaments.getTournament = function (id) {
    if (!tournaments[id]) {
      return undefined;
    }
    return tournaments[id].tournament;
  };

  Tournaments.getTournamentID = function (Tournament) {
    var tournamentid;

    for (tournamentid = 0; tournamentid < tournaments.length; tournamentid += 1) {
      if (tournaments[tournamentid].tournament && tournaments[tournamentid].tournament == Tournament) {
        return tournamentid;
      }
    }

    return undefined;
  };

  Tournaments.isRunning = function (id) {
    return tournaments[id] && tournaments[id].tournament != undefined;
  };

  /**
   * ends a tournament and removes its instance from this object
   * 
   * @param id
   * @returns true on success, undefined otherwise
   */
  Tournaments.endTournament = function (id) {
    // set the tournament to undefined, and it will be garbage collected.
    // the entry itself will remain
    var tournament, ranking;

    tournament = tournaments[id];

    if (!tournament.tournament) {
      console.error('cannot remove tournament #' + id + ': invalid index');
      return undefined;
    }

    if (tournament.tournament.getGames().length != 0) {
      console.error('cannot remove tournament #' + id + ': there are still open games');
      return undefined;
    }

    ranking = tournament.tournament.end();

    if (!ranking) {
      console.error('cannot remove tournament #' + id + ': tournament can not be ended');
      return undefined;
    }

    // TODO update global ranking and stuff

    // finally: remove the tournament
    tournament.tournament = undefined;

    return true;
  };

  Tournaments.toBlob = function () {
    var ob, id, t;

    ob = [];

    for (id = 0; id < tournaments.length; id += 1) {
      t = tournaments[id];
      ob[id] = [ t.type, t.name, t.tournament && t.tournament.toBlob(),
          t.teams, t.finalranking ];
    }

    return JSON.stringify(ob);
  };

  Tournaments.fromBlob = function (blob) {
    var ob, id, t;

    ob = JSON.parse(blob);

    Tournaments.reset();

    tournaments = [];

    for (id = 0; id < ob.length; id += 1) {
      t = ob[id];
      tournaments.push({
        type : t[0],
        name : t[1],
        tournament : (t[2] && createTournament(t[0], t[2])),
        teams : t[3],
        finalranking : t[4],
      });
    }
  };

  Tournaments.reset = function () {
    tournaments = [];
  };

  return Tournaments;
});
