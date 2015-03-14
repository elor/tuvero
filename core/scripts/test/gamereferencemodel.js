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
    var GameModel, GameReferenceModel, ListModel;

    GameModel = getModule('core/gamemodel');
    GameReferenceModel = getModule('core/gamereferencemodel');
    ListModel = getModule('core/listmodel');

    QUnit.test('GameReferenceModel', function() {
      var game, gameref, teamlist;

      teamlist = new ListModel();
      teamlist.push(5);
      teamlist.push(7);
      teamlist.push(3);
      teamlist.push(9);

      game = new GameModel([3, 2, 1, 0], 2, 5);
      QUnit.equal(game.getTeamID(0), 3, 'GameModel: internal value');
      QUnit.equal(game.getTeamID(1), 2, 'GameModel: internal value');
      QUnit.equal(game.getTeamID(2), 1, 'GameModel: internal value');
      QUnit.equal(game.getTeamID(3), 0, 'GameModel: internal value');

      gameref = new GameReferenceModel(game, teamlist);

      QUnit.equal(gameref.getID(), game.getID(), 'identical game ids');
      QUnit.equal(gameref.getGroup(), game.getGroup(), 'identical game group');

      QUnit.equal(gameref.getTeamID(0), 9, 'GameReferenceModel: global value');
      QUnit.equal(gameref.getTeamID(1), 3, 'GameReferenceModel: global value');
      QUnit.equal(gameref.getTeamID(2), 7, 'GameReferenceModel: global value');
      QUnit.equal(gameref.getTeamID(3), 5, 'GameReferenceModel: global value');

      teamlist.set(1, 12);
      teamlist.remove(0);
      teamlist.push(53);
      teamlist.remove(2);

      // The time of reference is relevant, not the team list at a later time
      QUnit.equal(gameref.getTeamID(0), 9, 'teamlist changes have no impact');
      QUnit.equal(gameref.getTeamID(1), 3, 'teamlist changes have no impact');
      QUnit.equal(gameref.getTeamID(2), 7, 'teamlist changes have no impact');
      QUnit.equal(gameref.getTeamID(3), 5, 'teamlist changes have no impact');
    });
  };
});
