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
    var ListModel, MatchModel, MatchReferenceListModel, Listener;

    Listener = getModule('core/listener');
    ListModel = getModule('core/listmodel');
    MapListModel = getModule('core/maplistmodel');

    QUnit.test('MapListModel', function() {
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

      QUnit.equal(refs.length, indices.length,
          'number of teams match after initialization');
      QUnit.deepEqual(refs.asArray(), [4, 2, 0], 'ids get translated');

      listener = new Listener(refs);
      listener.oninsert = function() {
        this.success = true;
      };

      indices.push(2);

      QUnit.ok(listener.success, '"insert" event is re-emitted');
      QUnit.equal(refs.length, 4, 'new team gets added to the indices list');
      listener.destroy();

      QUnit.deepEqual(refs.asArray(), [4, 2, 0, 3], 'ids get translated');

      listener = new Listener(refs);
      listener.onremove = function() {
        this.success = true;
      };

      indices.remove(2);
      QUnit.equal(indices.length, 3, 'match has been removed from indices');
      QUnit.equal(refs.length, 3, 'match has been removed from refs');
      QUnit.ok(listener.success, '"remove" event propagates to the matchref');
      QUnit.deepEqual(refs.asArray(), [4, 2, 3], 'ids get translated');
    });
  };
});
