/**
 * This object is intended to create and reference a Swisstournament singleton
 */
define([ '../backend/swisstournament' ], function (Swisstournament) {
  var Tournaments, tournaments, names;

  Tournaments = {};
  tournaments = [];
  names = [];

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

    Tournaments.setName(tournaments.length, type);
    tournaments.push(newtournament);

    return newtournament;
  };

  Tournaments.setName = function (i, name) {
    names[i] = name;
  };

  Tournaments.getName = function (i) {
    return names[i];
  };

  Tournaments.size = function () {
    return tournaments.length;
  };

  Tournaments.get = function (i) {
    var tournament;

    tournament = tournaments[i];
    if (tournament) {
      return tournament;
    }

    console.error('invalid tournament index #' + i);
    return undefined;
  };

  Tournaments.removeTournament = function (i) {
    var tournament, ranking;

    tournament = tournaments[i];

    if (!tournament) {
      console.error('cannot remove tournament #' + i + ': invalid index');
      return undefined;
    }

    if (tournament.getGames().length != 0) {
      console.error('cannot remove tournament #' + i + ': there are still open games');
      return undefined;
    }

    ranking = tournament.end();

    if (!ranking) {
      console.error('cannot remove tournament #' + i + ': tournament can not be ended');
      return undefined;
    }

    // TODO update global ranking and stuff

    // finally: remove the tournament
    tournaments.splice(i, 1);
    names.splice(i, 1);

  };

  Tournaments.toBlob = function () {
    var ob, i;

    ob = [];

    for (i = 0; i < tournaments.length; i += 1) {
      ob[i] = [ tournaments[i].getType(), names[i], tournaments[i].toBlob() ];
    }

    return JSON.stringify(ob);
  };

  Tournaments.fromBlob = function (blob) {
    var ob, i, line;

    ob = JSON.parse(blob);

    Tournaments.reset();

    tournaments = [];
    for (i = 0; i < ob.length; i += 1) {
      line = ob[i];
      Tournaments.addTournament(line[0]).fromBlob(line[2]);
      names[i] = line[1];
    }
  };

  Tournaments.reset = function () {
    // TODO uncomment AFTER removing swiss.js
    // tournaments = [];
    // names = [];
  };

  Tournaments.addTournament('swiss');

  return Tournaments;
});
