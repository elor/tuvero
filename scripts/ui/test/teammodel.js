/**
 * Unit tests for TeamModel
 *
 * @return test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, TeamModel, PlayerModel, IndexedModel;

    extend = getModule('lib/extend');
    TeamModel = getModule('ui/teammodel');
    IndexedModel = getModule('list/indexedmodel');
    PlayerModel = getModule('ui/playermodel');

    QUnit.test('TeamModel', function (assert) {
      var team, players, names, listener;

      assert.ok(extend.isSubclass(TeamModel, IndexedModel),
          'TeamModel is subclass of IndexedModel');

      listener = {
        updatecount: 0,
        /**
         * Callback listener
         */
        onupdate: function() {
          listener.updatecount += 1;
        },
        /**
         * counter reset
         */
        reset: function() {
          listener.updatecount = 0;
        },
        emitters: []
      };

      team = new TeamModel();
      assert.equal(team.length, 1,
          'empty initialization generates an empty team player');
      assert.equal(team.getPlayer(0).getName(), PlayerModel.NONAME,
          'empty initialization generates an default team player name');
      assert.equal(team.getID(), -1, 'empty initialization sets id to -1');

      assert.equal(team.getPlayer(-1), undefined,
          'getPlayer(-1) returns undefined');
      assert.equal(team.getPlayer(5), undefined,
          'out of bounds getPlayer returns undefined');

      names = ['Erik E. Lorenz', 'Fabian Böttcher', 'Detlef Schwede'];
      players = [new PlayerModel(names[0]), new PlayerModel(names[1]),
          new PlayerModel(names[2])];
      team = new TeamModel(players, 5);

      assert.equal(team.length, players.length,
          'proper initialization: team length');
      assert.equal(team.getID(), 5, 'proper initialization sets id');
      assert.equal(team.getPlayer(0).getName(), names[0], 'player name 1');
      assert.equal(team.getPlayer(1).getName(), names[1], 'player name 2');
      assert.equal(team.getPlayer(2).getName(), names[2], 'player name 3');

      team.registerListener(listener);

      listener.reset();
      players[0].setName('Generic Name');
      players[1].setName('Another Generic Name');
      players[2].setName('Third Generic Name');
      assert.equal(listener.updatecount, 3,
          'player name updates propagate through to TeamModel');
    });
  };
});
