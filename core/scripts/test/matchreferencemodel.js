/**
 * unit test
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var MatchModel, MatchReferenceModel, ListModel;

    MatchModel = getModule('core/matchmodel');
    MatchReferenceModel = getModule('core/matchreferencemodel');
    ListModel = getModule('core/listmodel');

    QUnit.test('MatchReferenceModel', function() {
      var game, gameref, teamlist;

      teamlist = new ListModel();
      teamlist.push(5);
      teamlist.push(7);
      teamlist.push(3);
      teamlist.push(9);

      game = new MatchModel([3, 2, 1, 0], 2, 5);
      QUnit.equal(game.getTeamID(0), 3, 'MatchModel: internal value');
      QUnit.equal(game.getTeamID(1), 2, 'MatchModel: internal value');
      QUnit.equal(game.getTeamID(2), 1, 'MatchModel: internal value');
      QUnit.equal(game.getTeamID(3), 0, 'MatchModel: internal value');

      gameref = new MatchReferenceModel(game, teamlist);

      QUnit.equal(gameref.getID(), game.getID(), 'identical game ids');
      QUnit.equal(gameref.getGroup(), game.getGroup(), 'identical game group');

      QUnit.equal(gameref.getTeamID(0), 9, 'global value');
      QUnit.equal(gameref.getTeamID(1), 3, 'global value');
      QUnit.equal(gameref.getTeamID(2), 7, 'global value');
      QUnit.equal(gameref.getTeamID(3), 5, 'global value');

      teamlist.set(1, 12);
      teamlist.remove(0);
      teamlist.push(53);
      teamlist.remove(2);

      // The time of reference is relevant, not the team list at a later
      // time
      QUnit.equal(gameref.getTeamID(0), 9, 'teamlist changes have no impact');
      QUnit.equal(gameref.getTeamID(1), 3, 'teamlist changes have no impact');
      QUnit.equal(gameref.getTeamID(2), 7, 'teamlist changes have no impact');
      QUnit.equal(gameref.getTeamID(3), 5, 'teamlist changes have no impact');

      listener = {
        finished: false,
        onfinish: function() {
          this.finished = true;
        },
        emitters: []
      };

      game = new MatchModel([1, 2], 0, 2);
      gameref = new MatchReferenceModel(game, teamlist);
      gameref.registerListener(listener);
      game.finish([3, 4]);
      QUnit.equal(listener.finished, true, '"finish" event cascades through');

      listener.finished = false;
      game = new MatchModel([1, 2], 0, 2);
      gameref = new MatchReferenceModel(game, teamlist);
      game.registerListener(listener);
      gameref.finish([3, 4]);
      QUnit.equal(listener.finished, true, 'finish() is forwarded properly');

      listener.finished = false;
      game = new MatchModel([1, 2], 0, 2);
      gameref = new MatchReferenceModel(game, teamlist);
      gameref.registerListener(listener);
      gameref.finish([3, 4]);
      QUnit.equal(listener.finished, true, 'finish() -> onfinish roundtrip');
    });
  };
});
