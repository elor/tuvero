/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var extend, TournamentListModel, IndexedListModel, TournamentIndex

    extend = getModule('lib/extend')
    TournamentListModel = getModule('tournament/tournamentlistmodel')
    TournamentIndex = getModule('tournament/tournamentindex')
    IndexedListModel = getModule('list/indexedlistmodel')

    QUnit.test('TournamentListModel', function (assert) {
      var tournament, list, ref, savedata, ranking
      assert.ok(extend.isSubclass(TournamentListModel, IndexedListModel),
        'TournamentListModel is subclass of IndexedListModel')

      list = new TournamentListModel()

      assert.ok(list, 'TournamentListModel construction works')
      assert.equal(list.length, 0, 'no initial entries')
      assert.deepEqual(list.tournamentIDsForEachTeam(), [],
        'no tournament ids yet')

      tournament = TournamentIndex.createTournament('round', ['sonneborn', 'id'])
      tournament.addTeam(0)
      tournament.addTeam(1)
      tournament.addTeam(2)
      tournament.addTeam(4)

      list.push(tournament)

      ref = [0, 0, 0, undefined, 0]
      assert.deepEqual(list.tournamentIDsForEachTeam(), ref,
        'tournament ids for single tournament are correct')

      tournament = TournamentIndex.createTournament('round', ['sonneborn', 'id'])
      tournament.addTeam(1)
      tournament.addTeam(3)
      tournament.addTeam(5)

      list.push(tournament)

      ref = [0, 1, 0, 1, 0, 1]
      assert.deepEqual(list.tournamentIDsForEachTeam(), ref,
        'tournament ids for two tournaments are correct')

      // HACK! DO NOT ACCESS DIRECTLY!
      list.get(0).state.forceState('finished')
      ref = [undefined, 1, undefined, 1, undefined, 1]
      assert.deepEqual(list.tournamentIDsForEachTeam(), ref,
        'ids of finished tournaments are ignored (undefined)')

      savedata = list.save()
      assert.ok(savedata, 'save() returns properly')

      list = new TournamentListModel()
      assert.ok(list.restore(savedata), 'restore() returns true')
      assert.deepEqual(list.tournamentIDsForEachTeam(), ref,
        'restore() restores the ids for all players')

      // TODO test getGlobalRanking()
      // TODO test closeTournament()
      // TODO test push, insert, pop, remove and erase

      // interlacing
      list = new TournamentListModel()
      tournament = TournamentIndex.createTournament('round', ['id'])
      tournament.setProperty()
      tournament.addTeam(0)
      tournament.addTeam(1)
      tournament.addTeam(2)
      list.push(tournament, 0)

      // must start matches, else tournament gets purged on close due to initial state at end of tournamentlist
      tournament.run()
      tournament.getMatches().map(function (match) {
        match.finish([13, 0])
      })

      tournament = TournamentIndex.createTournament('round', ['id'])
      tournament.addTeam(3)
      tournament.addTeam(4)
      tournament.addTeam(5)
      list.push(tournament, 3)

      // must start matches, else tournament gets purged on close due to initial state at end of tournamentlist
      tournament.run()
      tournament.getMatches().map(function (match) {
        match.finish([13, 0])
      })

      list.closeTournament(0)
      list.closeTournament(1)

      list.interlaceCount.set(2)

      ref = undefined
      ranking = list.getGlobalRanking(6)
      assert.deepEqual(ranking.displayOrder, [0, 3, 1, 4, 2, 5], 'displayOrder')
    })
  }
})
