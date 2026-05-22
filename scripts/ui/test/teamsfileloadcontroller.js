/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import TeamsFileLoadController from '../teamsfileloadcontroller.js';
test('TeamsFileLoadController', () => {
  let input, output, reference;

  /*
   * Single Teams
   */
  input = '';
  reference = [];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'empty string').toEqual(reference);
  input = '\n';
  reference = [];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'empty line').toEqual(reference);
  input = 'Erik';
  reference = [['Erik']];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'single line').toEqual(reference);
  input = '"Erik"';
  reference = [['Erik']];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'quoted single line').toEqual(reference);
  input = '""';
  reference = [['']];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'quoted empty line').toEqual(reference);
  input = 'Erik ""Doublequote"" Lorenz';
  reference = [['Erik ""Doublequote"" Lorenz']];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'unquoted double-quote').toEqual(reference);
  input = '"Lorenz, Erik E."';
  reference = [['Lorenz, Erik E.']];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'quoted single line with a comma').toEqual(reference);
  input = '    Erik   ';
  reference = [['Erik']];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'space-padded single line').toEqual(reference);
  input = 'Erik, Fabe';
  reference = [['Erik', 'Fabe']];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'two players, one team').toEqual(reference);
  input = '"Erik, Fabe"';
  reference = [['Erik, Fabe']];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'quoted two-player line, one name').toEqual(reference);
  input = '"Erik", "Fabe"';
  reference = [['Erik', 'Fabe']];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'two quoted players').toEqual(reference);

  /*
   * Multiple Teams
   */
  input = 'Erik\nFabe';
  reference = [['Erik'], ['Fabe']];
  output = TeamsFileLoadController.parseCSVString(input);
  expect(output, 'two lines').toEqual(reference);
});