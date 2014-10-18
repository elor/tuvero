/**
 * Tournaments is a list of _running_ tournaments, with null entries for
 * finished tournaments, but still keeping name and type information
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ '../backend/swisstournament', '../backend/kotournament', './team', './shared' ], function (Swisstournament, KOTournament, Team, Shared) {
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
      tournament = new KOTournament();
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

  Tournaments.getStartRank = function (tournamentid, countchildren) {
    var id, parentid, startteam;

    if (tournamentid == undefined) {
      startteam = 0;
      parentid = undefined;
    } else {
      if (tournaments[tournamentid] === undefined) {
        // must be an error or the root node
        console.error('tournamentid not defined: ' + tournamentid);
        return undefined;
      }

      if (countchildren) {
        parentid = tournamentid;
      } else {
        parentid = tournaments[tournamentid].parent;
      }
      if (parentid == undefined) {
        startteam = 0;
      } else {
        // recursive functions FTW!
        startteam = Tournaments.getStartRank(parentid);
      }
    }

    for (id in tournaments) {
      if (tournaments[id].parent == parentid && (countchildren || tournamentid === undefined || id < tournamentid)) {
        startteam += tournaments[id].teams.length;
      }
    }

    return startteam;
  };

  Tournaments.numTeamsLeft = function (tournamentid) {
    var numteams, id;

    if (tournamentid === undefined) {
      numteams = Team.count();
    } else {
      if (tournaments[tournamentid] === undefined) {
        // must be an error
        console.error('tournament id not defined: ' + tournamentid);
        return 0;
      }
      numteams = tournaments[tournamentid].teams.length;
    }

    for (id in tournaments) {
      if (tournaments[id].parent == tournamentid) {
        numteams -= tournaments[id].teams.length;
      }
    }

    return numteams;
  };

  Tournaments.addTournament = function (type, numteams, parent) {
    var newtournament, i, teams, startteam, globalranking;

    teams = [];

    newtournament = createTournament(type);

    if (!newtournament) {
      return undefined;
    }

    startteam = Tournaments.getStartRank(parent, true);

    if (numteams > Tournaments.numTeamsLeft(parent)) {
      console.error('you want too many teams in your tournament');
      return undefined;
    }

    globalranking = Shared.GlobalRanking.get();

    console.log(startteam);

    for (i = 0; i < numteams; i += 1) {
      teams.push(globalranking[i + startteam].teamid);
      newtournament.addPlayer(globalranking[i + startteam].teamid);
    }

    // TODO verify parent number type / undefined

    tournaments.push({
      name : type,
      type : type,
      tournament : newtournament,
      teams : teams,
      parent : parent,
      finalranking : undefined,
    });

    return newtournament;
  };

  Tournaments.removeTournament = function (tournamentid) {
    var tournament;

    tournament = tournaments[tournamentid];
    if (!tournament || !tournament.tournament) {
      console.error('tournament already removed?');
      return undefined;
    }

    tournaments[tournamentid].finalranking = tournament.tournament.getRanking();
    tournaments[tournamentid].tournament = undefined;

    return true;
  };

  Tournaments.getParent = function (tournamentid) {
    return tournaments[tournamentid] && tournaments[tournamentid].parent;
  };

  /**
   * performs an inefficient left-traversal of the tournament tree and returns
   * the ranking order (left-right-parent)
   * 
   * @return an array with tournament ids, sorted by their logical global
   *          ranking order
   */
  Tournaments.getRankingOrder = function () {
    var queue, order, i, parent, children;

    queue = [ undefined ];

    while (queue.length) {
      parent = queue.shift();

      children = [];
      for (i = 0; i < tournaments.length; i += 1) {
        if (tournaments[i].parent == parent) {

          if (queue.indexOf(i) > -1) {
            console.error('already visited: ' + i);
          }

          children.push(i);
          queue.push(i);
        }
      }

      if (!order) {
        order = children;
      } else {
        i = order.indexOf(parent);
        if (i === -1) {
          console.error('parent id not found in index');
        }
        while (children.length) {
          order.splice(i, 0, children.pop());
        }
      }
    }

    return order;
  };

  Tournaments.numTournaments = function () {
    return tournaments.length;
  };

  Tournaments.setName = function (id, name) {
    tournaments[id].name = name;
  };

  Tournaments.getName = function (id) {
    return tournaments[id] && tournaments[id].name;
  };

  Tournaments.getType = function (id) {
    return tournaments[id] && tournaments[id].type;
  };

  Tournaments.getTeams = function (id) {
    return tournaments[id] && tournaments[id].teams;
  };

  Tournaments.getRanking = function (tournamentid) {
    var tournament;

    tournament = tournaments[tournamentid];

    if (!tournament) {
      console.error('tournamentid doesnt exist: ' + tournamentid);
      return undefined;
    }

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
   * @return true on success, undefined otherwise
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
          t.teams, t.finalranking, t.parent ];
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
        parent : t[5],
      });
    }
  };

  Tournaments.reset = function () {
    tournaments = [];
  };

  Shared.Tournaments = Tournaments;
  return Tournaments;
});
