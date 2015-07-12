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
    var ResultReferenceModel, MatchModel, ListModel, MatchResult;

    ResultReferenceModel = getModule('core/resultreferencemodel');
    MatchResult = getModule('core/matchresult');
    MatchModel = getModule('core/matchmodel');
    ListModel = getModule('core/listmodel');

    QUnit.test('ResultReferenceModel', function() {
      var game, result, ref, teamlist;

      teamlist = new ListModel();
      teamlist.push(5);
      teamlist.push(7);
      teamlist.push(3);
      teamlist.push(9);

      game = new MatchModel([3, 2, 1, 0], 2, 5);
      result = new MatchResult(game, [13, 7, 5, 2]);
      ref = new ResultReferenceModel(result, teamlist);

      QUnit.equal(ref.getID(), game.getID(), 'identical game ids');
      QUnit.equal(ref.getGroup(), game.getGroup(), 'identical game group');

      QUnit.deepEqual(ref.score, [13, 7, 5, 2], 'score is retained');
      QUnit.equal(ref.getTeamID(0), 9, 'global value');
      QUnit.equal(ref.getTeamID(1), 3, 'global value');
      QUnit.equal(ref.getTeamID(2), 7, 'global value');
      QUnit.equal(ref.getTeamID(3), 5, 'global value');

      teamlist.set(1, 12);
      teamlist.remove(0);
      teamlist.push(53);
      teamlist.remove(2);

      // The time of reference is relevant, not the team list at a later
      // time
      QUnit.equal(ref.getTeamID(0), 9, 'teamlist changes have no impact');
      QUnit.equal(ref.getTeamID(1), 3, 'teamlist changes have no impact');
      QUnit.equal(ref.getTeamID(2), 7, 'teamlist changes have no impact');
      QUnit.equal(ref.getTeamID(3), 5, 'teamlist changes have no impact');
    });
  };
});