/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, TournamentModel, PropertyModel;

    extend = getModule('lib/extend');
    TournamentModel = getModule('tournament/tournamentmodel');
    PropertyModel = getModule('core/propertymodel');

    QUnit.test('TournamentModel', function (assert) {
      var tournament, state, teams, matches, byes, match, ranking, ref, data, //
      history, combinedHistory, corrections, result;

      assert.ok(extend.isSubclass(TournamentModel, PropertyModel),
          'TournamentModel is subclass of PropertyModel');

      tournament = new TournamentModel(['wins', 'saldo']);
      assert.ok(tournament, 'construction works');

      state = tournament.getState();
      teams = tournament.getTeams();
      matches = tournament.getMatches();
      history = tournament.getHistory();
      combinedHistory = tournament.getCombinedHistory();
      corrections = tournament.getCorrections();
      byes = tournament.getVotes('bye');
      ranking = tournament.getRanking();

      assert.ok(state, 'getState() returns');
      assert.ok(teams, 'getTeams() returns');
      assert.ok(matches, 'getMatches() returns');
      assert.ok(history, 'getHistory() returns');
      assert.ok(combinedHistory, 'getHistory() returns');
      assert.ok(corrections, 'getCorrections() returns');
      assert.ok(byes, 'getTeams() returns');
      assert.ok(ranking, 'getRanking() returns');

      assert.equal(state.get(), 'initial',
          'tournament is constructed in initial state');

      assert.equal(teams.length, 0, 'no teams registered initially');

      assert.equal(matches.length, 0, 'no matches in initial state');

      assert.equal(byes.length, 0, 'no byes in initial state');

      assert.equal(tournament.getVotes('unknownVoteType'), undefined,
          'undefined vote type returns undefined');

      /*************************************************************************
       * run
       ************************************************************************/

      assert.equal(tournament.run(), undefined,
          'run() aborts with insufficient teams');

      assert.equal(tournament.addTeam(5), true, 'addTeam works');
      assert.equal(tournament.addTeam(4), true, 'addTeam works');
      assert.equal(tournament.addTeam(3), true, 'addTeam works');
      assert.equal(tournament.addTeam(2), true, 'addTeam works');
      assert.equal(tournament.addTeam(1), true, 'addTeam works');

      assert.equal(teams.length, 5, 'teams: length gets updated');
      assert.equal(tournament.teams.length, 5, 'teams: length gets updated');

      assert.equal(tournament.getID(), -1, 'initial id is -1');
      tournament.setID(5);
      assert.equal(tournament.getID(), 5, 'id can be changed with setID()');

      /*************************************************************************
       * first round
       ************************************************************************/

      assert.equal(tournament.run(), true, 'run() works with sufficient teams');

      assert.equal(state.get(), 'running', 'state is set to "running"');

      assert.equal(matches.length, 1, 'matches have been generated');
      assert.equal(byes.length, 1, 'byes have been generated');

      match = matches.get(0);
      assert.equal(match.getTeamID(0), 5, 'global team id in match');
      assert.equal(match.getTeamID(1), 4, 'global team id in match');

      assert.equal(byes.get(0), 3, 'global team id in bye');

      assert.ok(match.finish([12345, -53]),
          'match.finish() with invalid score points');

      assert.equal(matches.length, 1, 'match has not been finished');

      assert.equal(history.length, 0, 'match has not been pushed to history');

      assert.equal(combinedHistory.length, 1,
          'combinedHistory contains an element');

      assert.equal(tournament.finish(), false,
          'tournament cannot be finished when there are open matches');

      assert.ok(match.finish([13, 7]), 'match.finish() with proper scores');

      assert.equal(matches.length, 0, 'match has been finished');

      assert.equal(history.length, 1, 'match has been pushed to history');

      result = history.get(0);
      assert.equal(result.length, 2, 'history: length of match matches');
      assert.equal(result.getTeamID(0), 5, 'history: global team id in match');
      assert.equal(result.getTeamID(1), 4, 'history: global team id in match');

      assert.equal(state.get(), 'idle',
          'auto-transition to idle state after last match');

      assert.equal(byes.length, 0,
          'votes are cleared before transition to idle state');

      ref = {
        components: ['wins', 'saldo'],
        ids: [5, 4, 3, 2, 1],
        ranks: [0, 4, 1, 1, 1],
        displayOrder: [0, 2, 3, 4, 1],
        wins: [1, 0, 0, 0, 0],
        saldo: [6, -6, 0, 0, 0]
      };
      assert.deepEqual(ranking.get(), ref, 'ranking validation');

      /*************************************************************************
       * second round
       ************************************************************************/

      assert.equal(tournament.run(), true, 'run() works with sufficient teams');

      assert.equal(state.get(), 'running', 'state is set to "running"');

      assert.equal(matches.length, 1, 'matches have been generated');
      assert.equal(byes.length, 1, 'byes have been generated');
      assert.equal(history.length, 1, 'history contains a match and a bye');
      assert.equal(combinedHistory.length, 2,
          'combined history contains a current match, '
              + 'a finished match and the current bye');

      match = matches.get(0);
      assert.equal(match.getTeamID(0), 4, 'global team id in match');
      assert.equal(match.getTeamID(1), 3, 'global team id in match');

      assert.equal(byes.get(0), 5, 'global team id in bye');

      assert.equal(matches.length, 1, 'match has not been finished');

      assert.ok(match.finish([13, 7]), 'match.finish() with proper scores');

      assert.equal(matches.length, 0, 'match has been finished');

      assert.equal(state.get(), 'idle',
          'auto-transition to idle state after last match');

      assert.equal(byes.length, 0,
          'votes are cleared before transition to idle state');

      ref = {
        components: ['wins', 'saldo'],
        ids: [5, 4, 3, 2, 1],
        ranks: [0, 1, 4, 2, 2],
        displayOrder: [0, 1, 3, 4, 2],
        wins: [1, 1, 0, 0, 0],
        saldo: [6, 0, -6, 0, 0]
      };
      assert.deepEqual(ranking.get(), ref, 'ranking validation');

      assert.equal(tournament.finish(), true, 'tournament is finished');

      assert.equal(tournament.run(), undefined,
          'tournament cannot be un-finished');

      assert.deepEqual(ranking.get(), ref, 'ranking validation');

      tournament = new TournamentModel(['wins', 'saldo']);
      tournament.addTeam(5);
      tournament.addTeam(3);
      tournament.addTeam(4);
      tournament.addTeam(2);
      tournament.addTeam(1);

      tournament.run();
      tournament.getMatches().get(0).finish([8, 13]);
      tournament.run();

      tournament.setID(3);

      data = tournament.save();
      assert.ok(data, 'save() finishes');
      ref = tournament;
      tournament = new TournamentModel();
      assert.ok(tournament.restore(data), 'restore() finishes');

      state = tournament.getState();
      teams = tournament.getTeams();
      matches = tournament.getMatches();
      history = tournament.getHistory();
      corrections = tournament.getCorrections();
      byes = tournament.getVotes('bye');
      ranking = tournament.getRanking();

      assert.equal(tournament.getID(), 3, 'restore() restored the id');
      assert.deepEqual(teams.asArray(), ref.getTeams().asArray(),
          'restore() restored the teams');
      assert.equal(state.get(), 'running',
          'restore() restored the "running" state');
      assert.equal(matches.length, 1, 'restore() restored matches.length');
      match = matches.get(0);
      assert.equal(match.getTeamID(0), 3, 'restore(): team id in match');
      assert.equal(match.getTeamID(1), 4, 'restore(): team id in match');
      assert.deepEqual(byes.asArray(), [5], 'restore() restored the byes');
      assert.deepEqual(ranking.get(), ref.getRanking().get(),
          'restore() restored the whole ranking');
      result = history.get(0);
      assert.equal(history.length, 1, 'restore(): history size');
      assert.equal(result.length, 2,
          'restore(): restored number of teams in history result');
      assert.equal(result.getTeamID(0), 5, 'restore() history team id 1');
      assert.equal(result.getTeamID(1), 3, 'restore() history team id 2');

      // FIXME test corrections
      // FIXME test history (default, after some tournaments, after
      // restore)
    });
  };
});
