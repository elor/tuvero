/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var TeamsFileLoadController

    TeamsFileLoadController = getModule('ui/teamsfileloadcontroller')

    QUnit.test('TeamsFileLoadController', function (assert) {
      var input, output, reference

      /*
       * Single Teams
       */
      input = ''
      reference = []
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'empty string')

      input = '\n'
      reference = []
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'empty line')

      input = 'Erik'
      reference = [
        ['Erik']
      ]
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'single line')

      input = '"Erik"'
      reference = [
        ['Erik']
      ]
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'quoted single line')

      input = '""'
      reference = [
        ['']
      ]
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'quoted empty line')

      input = 'Erik ""Doublequote"" Lorenz'
      reference = [
        ['Erik ""Doublequote"" Lorenz']
      ]
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'unquoted double-quote')

      input = '"Lorenz, Erik E."'
      reference = [
        ['Lorenz, Erik E.']
      ]
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'quoted single line with a comma')

      input = '    Erik   '
      reference = [
        ['Erik']
      ]
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'space-padded single line')

      input = 'Erik, Fabe'
      reference = [
        ['Erik', 'Fabe']
      ]
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'two players, one team')

      input = '"Erik, Fabe"'
      reference = [
        ['Erik, Fabe']
      ]
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'quoted two-player line, one name')

      input = '"Erik", "Fabe"'
      reference = [
        ['Erik', 'Fabe']
      ]
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'two quoted players')

      /*
       * Multiple Teams
       */
      input = 'Erik\nFabe'
      reference = [
        ['Erik'],
        ['Fabe']
      ]
      output = TeamsFileLoadController.parseCSVString(input)
      assert.deepEqual(output, reference, 'two lines')
    })
  }
})
