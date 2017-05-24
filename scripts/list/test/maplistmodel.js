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
    var ListModel, MatchReferenceListModel, Listener;

    Listener = getModule('core/listener');
    ListModel = getModule('list/listmodel');
    MapListModel = getModule('list/maplistmodel');

    QUnit.test('MapListModel', function (assert) {
      var teams, list, refs, listener, matchref;

      teams = new ListModel();
      teams.push(5);
      teams.push(4);
      teams.push(3);
      teams.push(2);
      teams.push(1);
      teams.push(0);

      indices = new ListModel();
      indices.push(1);
      indices.push(3);
      indices.push(5);

      refs = new MapListModel(indices, teams);

      assert.equal(refs.length, indices.length,
          'number of teams match after initialization');
      assert.deepEqual(refs.asArray(), [4, 2, 0], 'ids get translated');

      listener = new Listener(refs);
      listener = new Listener(refs);
      listener.success = false;
      listener.callcount = 0;
      listener.oninsert = function() {
        this.success = true;
        this.callcount += 1;
      };

      indices.push(2);

      assert.ok(listener.success, '"insert" event is re-emitted');
      assert.equal(listener.callcount, 1, '"insert" is emitted exactly once');
      assert.equal(refs.length, 4, 'new team gets added to the indices list');
      listener.destroy();

      assert.deepEqual(refs.asArray(), [4, 2, 0, 3], 'ids get translated');

      listener = new Listener(refs);
      listener.success = false;
      listener.callcount = 0;
      listener.onremove = function() {
        this.success = true;
        this.callcount += 1;
      };

      indices.remove(2);
      assert.equal(indices.length, 3, 'match has been removed from indices');
      assert.equal(refs.length, 3, 'match has been removed from refs');
      assert.ok(listener.success, '"remove" event propagates to the matchref');
      assert.equal(listener.callcount, 1, '"remove" is emitted exactly once');
      assert.deepEqual(refs.asArray(), [4, 2, 3], 'ids get translated');
    });
  };
});
