/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import CorrectionReferenceModel from '../correctionreferencemodel.js';
import CorrectionModel from '../correctionmodel.js';
import MatchModel from '../matchmodel.js';
import MatchResult from '../matchresult.js';
import ListModel from '../../list/listmodel.js';
test('CorrectionReferenceModel', () => {
  let result, result2, correction, reference, teams;
  expect(
    CorrectionReferenceModel.prototype instanceof CorrectionModel,
    'CorrectionReferenceModel is subclass of CorrectionModel'
  ).toBeTruthy();
  teams = new ListModel();
  teams.push(5);
  teams.push(3);
  teams.push(6);
  teams.push(1);
  teams.push(13);
  teams.push(0);
  result = new MatchResult(new MatchModel([5, 3], 1, 2), [13, 7]);
  result2 = new MatchResult(new MatchModel([2, 4], 2, 1), [8, 9]);
  correction = new CorrectionModel(result, result2);
  reference = new CorrectionReferenceModel(correction, teams);
  expect(reference.before.result, 'before result reference is set').toBe(result);
  expect(reference.after.result, 'after result reference is set').toBe(result2);
  expect(reference.before.teams, 'before teams correctly referenced').toEqual([0, 1]);
  expect(reference.after.teams, 'after teams correctly referenced').toEqual([6, 13]);
  expect(reference.before.score, 'before score is correct').toEqual(result.score);
  expect(reference.after.score, 'after score is correct').toEqual(result2.score);
  expect(reference.before.getID(), 'before id matches').toBe(1);
  expect(reference.after.getID(), 'after id matches').toBe(2);
  expect(reference.before.getGroup(), 'before group matches').toBe(2);
  expect(reference.after.getGroup(), 'after group matches').toBe(1);
});