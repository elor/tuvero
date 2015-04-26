/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, TournamentModel, PropertyModel;

    extend = getModule('lib/extend');
    TournamentModel = getModule('core/tournamentmodel');
    PropertyModel = getModule('core/propertymodel');

    QUnit.test('TournamentModel', function() {
      var tournament, state, teams, matches, byes, match;

      QUnit.ok(extend.isSubclass(TournamentModel, PropertyModel),
          'TournamentModel is subclass of PropertyModel');

      tournament = new TournamentModel(['wins', 'saldo']);
      QUnit.ok('construction works');

      state = tournament.getState();
      teams = tournament.getTeams();
      matches = tournament.getMatches();
      byes = tournament.getVotes('bye');

      QUnit.ok(state, 'getState() returns');
      QUnit.ok(teams, 'getTeams() returns');
      QUnit.ok(matches, 'getMatches() returns');
      QUnit.ok(byes, 'getTeams() returns');

      QUnit.equal(state.get(), 'initial',
          'tournament is constructed in initial state');

      QUnit.equal(teams.length, 0, 'no teams registered initially');

      QUnit.equal(matches.length, 0, 'no matches in initial state');

      QUnit.equal(byes.length, 0, 'no byes in initial state');

      QUnit.equal(tournament.getVotes('unknownVoteType'), undefined,
          'undefined vote type returns undefined');

      /*************************************************************************
       * run
       ************************************************************************/

      QUnit.equal(tournament.run(), undefined,
          'run() aborts with insufficient teams');

      QUnit.equal(tournament.addTeam(5), true, 'addTeam works');
      QUnit.equal(tournament.addTeam(4), true, 'addTeam works');
      QUnit.equal(tournament.addTeam(3), true, 'addTeam works');
      QUnit.equal(tournament.addTeam(2), true, 'addTeam works');
      QUnit.equal(tournament.addTeam(1), true, 'addTeam works');

      QUnit.equal(teams.length, 5, 'teams: length gets updated');
      QUnit.equal(tournament.teams.length, 5, 'teams: length gets updated');

      /*************************************************************************
       * first round
       ************************************************************************/

      QUnit.equal(tournament.run(), true, 'run() works with sufficient teams');

      QUnit.equal(state.get(), 'running', 'state is set to "running"');

      QUnit.equal(matches.length, 1, 'matches have been generated');
      QUnit.equal(byes.length, 1, 'byes have been generated');

      match = matches.get(0);
      QUnit.equal(match.getTeamID(0), 5, 'global team id in match');
      QUnit.equal(match.getTeamID(1), 4, 'global team id in match');

      QUnit.equal(byes.get(0), 3, 'global team id in bye');

      QUnit.ok(match.finish([12345, -53]),
          'match.finish() with invalid score points');

      QUnit.equal(matches.length, 1, 'match has not been finished');

      QUnit.equal(tournament.finish(), false,
          'tournament cannot be finished when there are open matches');

      QUnit.ok(match.finish([13, 7]), 'match.finish() with proper scores');

      QUnit.equal(matches.length, 0, 'match has been finished');

      QUnit.equal(state.get(), 'idle',
          'auto-transition to idle state after last match');

      QUnit.equal(byes.length, 0,
          'votes are cleared before transition to idle state');

      QUnit.ok(false, 'TODO validate ranking');

      /*************************************************************************
       * second round
       ************************************************************************/

      QUnit.equal(tournament.run(), true, 'run() works with sufficient teams');

      QUnit.equal(state.get(), 'running', 'state is set to "running"');

      QUnit.equal(matches.length, 1, 'matches have been generated');
      QUnit.equal(byes.length, 1, 'byes have been generated');

      match = matches.get(0);
      QUnit.equal(match.getTeamID(0), 4, 'global team id in match');
      QUnit.equal(match.getTeamID(1), 3, 'global team id in match');

      QUnit.equal(byes.get(0), 5, 'global team id in bye');

      QUnit.equal(matches.length, 1, 'match has not been finished');

      QUnit.ok(match.finish([13, 7]), 'match.finish() with proper scores');

      QUnit.equal(matches.length, 0, 'match has been finished');

      QUnit.equal(state.get(), 'idle',
          'auto-transition to idle state after last match');

      QUnit.equal(byes.length, 0,
          'votes are cleared before transition to idle state');

      QUnit.ok(false, 'TODO validate ranking');

      QUnit.equal(tournament.finish(), true, 'tournament is finished');

      QUnit.equal(tournament.run(), undefined,
          'tournament cannot be un-finished');

      QUnit.ok(false, 'TODO validate ranking');
    });
  };
});
