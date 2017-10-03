/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var TeamsFileLoadController, ValueModel;

    TeamsFileLoadController = getModule('ui/teamsfileloadcontroller');
    ValueModel = getModule('core/valuemodel');

    QUnit.test('TeamsFileLoadController', function (assert) {
      var input, output, reference, teamsize;

      teamsize = new ValueModel(0);

      /*
       * Single Teams
       */
      input = '';
      reference = [];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'empty string');

      input = '\n';
      reference = [];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'empty line');

      input = 'Erik';
      reference = [['Erik']];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'single line');

      input = '"Erik"';
      reference = [['Erik']];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'quoted single line');

      input = '""';
      reference = [];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'quoted empty line');

      input = '"Erik ""Doublequote"" Lorenz"';
      reference = [['Erik "Doublequote" Lorenz']];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'quoted double-quote');

      input = '"Lorenz, Erik E."';
      reference = [['Lorenz, Erik E.']];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'quoted single line with a comma');

      input = '    Erik   ';
      reference = [['Erik']];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'space-padded single line');

      input = 'Erik, Fabe';
      reference = [['Erik', 'Fabe']];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'two players, one team');

      input = '"Erik, Fabe"';
      reference = [['Erik, Fabe']];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'quoted two-player line, one name');

      input = '"Erik", "Fabe"';
      reference = [['Erik', 'Fabe']];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'two quoted players');

      /*
       * Multiple Teams
       */
      input = 'Erik\nFabe';
      reference = [['Erik'], ['Fabe']];
      output = TeamsFileLoadController.parseCSVString(input);
      assert.deepEqual(output, reference, 'two lines');

      /*
       * Teamsizes
       */
      input = [];
      assert.equal(TeamsFileLoadController.readTeamsize(input), 0,
          'no team -> error');

      input = [[]];
      assert.equal(TeamsFileLoadController.readTeamsize(input), 0,
          'empty team -> error');

      input = [['asd'], []];
      assert.equal(TeamsFileLoadController.readTeamsize(input), 0,
          'empty team among others -> error');

      input = [['asd'], ['dsa', 'sdf']];
      assert.equal(TeamsFileLoadController.readTeamsize(input), 0,
          'different team sizes -> error');

      input = [['asd'], ['dsa'], ['sdf']];
      assert.equal(TeamsFileLoadController.readTeamsize(input), 1,
          'teamsize == 1');

      input = [['asd', 'dsa'], ['sdf', 'fds'], ['fda', 'fad']];
      assert.equal(TeamsFileLoadController.readTeamsize(input), 2,
          'teamsize == 2');
    });
  };
});
