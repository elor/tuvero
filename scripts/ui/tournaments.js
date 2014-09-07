/**
 * Tournaments is a list of _running_ tournaments, with null entries for
 * finished tournaments, but still keeping name and type information
 */
define([ '../backend/swisstournament' ], function (Swisstournament) {
  var Tournaments, tournaments;

  Tournaments = {};
  tournaments = [];

  Tournaments.addTournament = function (type) {
    var newtournament;

    newtournament = undefined;

    switch (type) {
    case 'swiss':
      newtournament = new Swisstournament();
      break;
    case 'ko':
      console.log(type + ' tournament type coming soon');
      break;
    default:
      console.error('undefined tournament type: ' + type);
      return undefined;
    }

    if (!newtournament) {
      return undefined;
    }

    tournaments.push({
      name : type,
      type : type,
      tournament : newtournament,
    });

    return newtournament;
  };

  Tournaments.size = function () {
    return tournaments.length;
  };

  Tournaments.setName = function (id, name) {
    tournaments[id].name = name;
  };

  Tournaments.getName = function (id) {
    return tournaments[id].name;
  };

  Tournaments.getTournament = function (id) {
    return tournaments[id].tournament;
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
      ob[id] = [ t.type, t.name, t.tournament.toBlob() ];
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
      if (t[2]) {
        Tournaments.addTournament(t[0]).fromBlob(t[2]);
        Tournaments.setName(id, t[1]);
      } else {
        tournaments.push({
          type : t[0],
          name : t[1],
          tournament : undefined,
        });
      }
    }
  };

  Tournaments.reset = function () {
    tournaments = [];
    // TODO remove this line AFTER removing swiss.js
    Tournaments.addTournament('swiss');
    Tournaments.setName(0, 'Schweizer System');
  };

  // TODO remove this line AFTER removing swiss.js
  Tournaments.reset();

  return Tournaments;
});
