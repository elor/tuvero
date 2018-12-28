/**
 * Unit tests for ListModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var ListModel, MatchModel, ReferenceListModel, MatchReferenceModel, Listener

    Listener = getModule('core/listener')
    ListModel = getModule('list/listmodel')
    MatchModel = getModule('core/matchmodel')
    MatchReferenceModel = getModule('core/matchreferencemodel')
    ReferenceListModel = getModule('list/referencelistmodel')

    QUnit.test('ReferenceListModel', function (assert) {
      var teams, matches, refs, listener, matchref

      teams = new ListModel()
      teams.push('5')
      teams.push('4')
      teams.push('3')
      teams.push('2')
      teams.push('1')
      teams.push('0')

      matches = new ListModel()
      matches.push(new MatchModel([1, 2], 0, 0))
      matches.push(new MatchModel([0, 5], 1, 0))

      refs = new ReferenceListModel(matches, teams, MatchReferenceModel)

      assert.equal(refs.length, matches.length,
        'number of teams match after initialization')

      listener = new Listener(refs)
      listener.success = false
      listener.callcount = 0
      listener.oninsert = function () {
        this.success = true
        this.callcount += 1
      }

      matches.push(new MatchModel([4, 3], 2, 0))

      assert.ok(listener.success, '"insert" event is re-emitted')
      assert.equal(listener.callcount, 1, '"insert" is emitted exactly once')
      assert.equal(refs.length, 3, 'new team gets added to the matches list')
      listener.destroy()

      matchref = refs.get(0)
      assert.equal(matchref.getTeamID(0), 4, 'team id gets translated')
      assert.equal(matchref.getTeamID(1), 3, 'team id gets translated')
      matchref = refs.get(1)
      assert.equal(matchref.getTeamID(0), 5, 'team id gets translated')
      assert.equal(matchref.getTeamID(1), 0, 'team id gets translated')
      matchref = refs.get(2)
      assert.equal(matchref.getTeamID(0), 1, 'team id gets translated')
      assert.equal(matchref.getTeamID(1), 2, 'team id gets translated')

      listener = new Listener(matchref)
      listener.numEvents = 0
      listener.onfinish = function () {
        this.numEvents += 1
      }
      matches.get(2).registerListener(listener)

      matches.get(2).finish([13, 7])
      assert.equal(listener.numEvents, 2,
        'both "finish" events propagate to the matchref')
      assert.equal(matches.length, 3, 'match has not been removed by finish()')

      listener.destroy()
      listener = new Listener(refs)
      listener.success = false
      listener.callcount = 0
      listener.onremove = function () {
        this.success = true
        this.callcount += 1
      }
      matches.remove(2)
      assert.equal(matches.length, 2, 'match has been removed from matches')
      assert.equal(refs.length, 2, 'match has been removed from refs')
      assert.ok(listener.success, '"remove" event propagates to the matchref')
      assert.equal(listener.callcount, 1, '"remove" is emitted exactly once')
    })
  }
})
