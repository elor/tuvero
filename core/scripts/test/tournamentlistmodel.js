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
    var extend, TournamentListModel, IndexedListModel, TournamentIndex;

    extend = getModule('lib/extend');
    TournamentListModel = getModule('core/tournamentlistmodel');
    TournamentIndex = getModule('core/tournamentindex');
    IndexedListModel = getModule('core/indexedlistmodel');

    QUnit.test('TournamentListModel', function() {
      var tournament, list, ref, savedata;
      QUnit.ok(extend.isSubclass(TournamentListModel, IndexedListModel),
          'TournamentListModel is subclass of IndexedListModel');

      list = new TournamentListModel();

      QUnit.ok(list, "TournamentListModel construction works");
      QUnit.equal(list.length, 0, "no initial entries");
      QUnit.deepEqual(list.tournamentIDsForEachTeam(), [],
          'no tournament ids yet');

      tournament = TournamentIndex.createTournament('round');
      tournament.addTeam(0);
      tournament.addTeam(1);
      tournament.addTeam(2);
      tournament.addTeam(4);

      list.push(tournament);

      ref = [0, 0, 0, undefined, 0];
      QUnit.deepEqual(list.tournamentIDsForEachTeam(), ref,
          'tournament ids for single tournament are correct');

      tournament = TournamentIndex.createTournament('round');
      tournament.addTeam(1);
      tournament.addTeam(3);
      tournament.addTeam(5);

      list.push(tournament);

      ref = [0, 1, 0, 1, 0, 1];
      QUnit.deepEqual(list.tournamentIDsForEachTeam(), ref,
          'tournament ids for two tournaments are correct');

      // HACK! DO NOT ACCESS DIRECTLY!
      list.get(0).state.forceState("finished");
      ref = [undefined, 1, undefined, 1, undefined, 1];
      QUnit.deepEqual(list.tournamentIDsForEachTeam(), ref,
          'ids of finished tournaments are ignored (undefined)');

      savedata = list.save();
      QUnit.ok(savedata, 'save() returns properly');

      list = new TournamentListModel();
      QUnit.ok(list.restore(savedata), 'restore() returns true');
      QUnit.deepEqual(list.tournamentIDsForEachTeam(), ref,
          'restore() restores the ids for all players');
    });
  };
});
