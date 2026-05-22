/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import extend from '../../lib/extend.js';
import MatchModel from '../matchmodel.js';
import MatchResult from '../matchresult.js';
import CorrectionModel from '../correctionmodel.js';
import Model from '../model.js';
test('CorrectionModel', () => {
  var match, result, result2, correction, data, success;
  expect(
    extend.isSubclass(CorrectionModel, Model),
    'CorrectionModel is subclass of Model'
  ).toBeTruthy();
  match = new MatchModel([1, 4], 0, 1);
  result = new MatchResult(match, [13, 7]);
  result2 = new MatchResult(result, [7, 13]);
  correction = new CorrectionModel(result, result2);
  expect(correction, 'construction works').toBeTruthy();
  expect(correction.before, "'before' stored as reference").toBe(result);
  expect(correction.after, "'after' stored as reference").toBe(result2);

  /*
   * erronuous construction -> throw
   */
  try {
    correction = new CorrectionModel('asd', {
      pi: 3
    });
    success = false;
  } catch (e) {
    success = true;
  }
  expect(success, 'the constructor throws on invalid values').toBeTruthy();

  /*
   * default construction
   */

  correction = new CorrectionModel();
  expect(correction, 'default construction works').toBeTruthy();
  expect(correction.before, 'default construction of pre-correction result').toEqual(new MatchResult());
  expect(correction.after, 'default construction of post-correction result').toEqual(new MatchResult());

  /*
   * save/restore
   */
  correction = new CorrectionModel(result, result2);
  data = correction.save();
  expect(data, 'save() returns').toBeTruthy();
  correction = new CorrectionModel();
  expect(correction.restore(data), 'restore() returns').toBeTruthy();
  expect(correction.before, 'restore() restores the pre-correction result').toEqual(result);
  expect(correction.after, 'restore() restores the post-correction result').toEqual(result2);
});