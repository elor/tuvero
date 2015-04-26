/**
 * Unit tests for ListModel
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
    MatchModel = getModule('core/matchmodel');
    MatchReferenceListModel = getModule('core/matchreferencelistmodel');

    QUnit.test('MatchReferenceListModel', function() {
      var teams, matches, refs, listener, listener2, matchref;

      teams = new ListModel();
      teams.push('5');
      teams.push('4');
      teams.push('3');
      teams.push('2');
      teams.push('1');
      teams.push('0');

      matches = new ListModel();
      matches.push(new MatchModel([1, 2], 0, 0));
      matches.push(new MatchModel([0, 5], 1, 0));

      refs = new MatchReferenceListModel(matches, teams);

      QUnit.equal(refs.length, matches.length,
          'number of teams match after initialization');

      listener = new Listener(refs);
      listener.oninsert = function() {
        this.success = true;
      };

      matches.push(new MatchModel([4, 3], 2, 0));

      QUnit.ok(listener.success, '"insert" event is re-emitted');
      QUnit.equal(refs.length, 3, 'new team gets added to the matches list');
      listener.destroy();

      matchref = refs.get(0);
      QUnit.equal(matchref.getTeamID(0), 4, 'team id gets translated');
      QUnit.equal(matchref.getTeamID(1), 3, 'team id gets translated');
      matchref = refs.get(1);
      QUnit.equal(matchref.getTeamID(0), 5, 'team id gets translated');
      QUnit.equal(matchref.getTeamID(1), 0, 'team id gets translated');
      matchref = refs.get(2);
      QUnit.equal(matchref.getTeamID(0), 1, 'team id gets translated');
      QUnit.equal(matchref.getTeamID(1), 2, 'team id gets translated');

      listener = new Listener(matchref);
      listener.numEvents = 0;
      listener.onfinish = function() {
        this.numEvents += 1;
      };
      matches.get(2).registerListener(listener);

      matches.get(2).finish([13, 7]);
      QUnit.equal(listener.numEvents, 2,
          'both "finish" events propagate to the matchref');
      QUnit.equal(matches.length, 3, 'match has not been removed by finish()');

      listener.destroy();
      listener = new Listener(refs);
      listener.onremove = function() {
        this.success = true;
      };
      matches.remove(2);
      QUnit.equal(matches.length, 2, 'match has been removed from matches');
      QUnit.equal(refs.length, 2, 'match has been removed from refs');
      QUnit.ok(listener.success, '"remove" event propagates to the matchref');
    });
  };
});
