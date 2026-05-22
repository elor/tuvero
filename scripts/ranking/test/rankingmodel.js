/**
 * RankingModel class tests
 *
 * @return test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import RankingModel from '../rankingmodel.js';
import MatchResult from '../../core/matchresult.js';
import MatchModel from '../../core/matchmodel.js';
import Listener from '../../core/listener.js';
import Model from '../../core/model.js';
import Options from 'options';
import extend from '../../lib/extend.js';
import CorrectionModel from '../../core/correctionmodel.js';
test('RankingModel', () => {
  let ranking, rankingobject, ref, listener, savedata, ret;
  expect(Options.byepointswon, 'Options.byepointswon is set properly').toBe(13);
  expect(Options.byepointslost, 'Options.byepointslost is set properly').toBe(7);
  listener = new Listener();
  listener.reset = function () {
    this.updated = 0;
    this.numreset = 0;
    this.resized = 0;
  };
  listener.onupdate = function () {
    this.updated += 1;
  };
  listener.onreset = function () {
    this.numreset += 1;
  };
  listener.onresize = function () {
    this.resized += 1;
  };
  expect(
    extend.isSubclass(RankingModel, Model),
    'RankingModel is a subclass of Model and, hence, Emitter'
  ).toBeTruthy();
  ranking = new RankingModel();
  expect(ranking, 'empty initialization produces a valid ranking').toBeTruthy();
  ref = {
    components: [],
    ids: [],
    displayOrder: [],
    ranks: []
  };
  expect(ranking.get(), 'empty initialization produces a valid ranking').toEqual(ref);
  ranking = new RankingModel([], 5);
  expect(ranking, 'empty components produce empty ranking').toBeTruthy();
  expect(ranking.length, 'empty ranking has no length').toBe(0);
  ranking = new RankingModel([], 5, ['wins', 'points']);
  expect(ranking.extDeps, 'empty ranking does not ignore extra dependencies').toEqual(['wins', 'points']);
  expect(ranking.points, 'extradeps: wins are created and listening').toBeTruthy();
  expect(ranking.wins, 'extradeps: points are created and listening').toBeTruthy();
  ranking = new RankingModel(['points'], 5);
  expect(ranking, 'valid initialization').toBeTruthy();
  expect(ranking.length, 'valid ranking size').toBe(5);
  ranking = new RankingModel(['points']);
  expect(ranking, 'sizeless ranking can be created').toBeTruthy();
  expect(ranking.length, 'ranking size defaults to 0').toBe(0);
  ranking = new RankingModel(['numgames', 'wins', 'saldo', 'points'], 5);
  expect(ranking.dataListeners.numgames.isPrimary(), 'numgames is primary').toBe(true);
  expect(ranking.dataListeners.wins.isPrimary(), 'wins is primary').toBe(true);
  expect(ranking.dataListeners.saldo.isPrimary(), 'saldo is secondary').toBe(false);
  expect(ranking.dataListeners.points.isPrimary(), 'points is primary').toBe(true);
  expect(ranking.dataListeners.lostpoints.isPrimary(), 'lostpoints is primary').toBe(true);
  ranking = new RankingModel(['numgames', 'wins'], 5, ['saldo']);
  expect(
    ranking.dataListeners.saldo.isPrimary(),
    'extraDependency: saldo is secondary'
  ).toBe(false);
  expect(
    ranking.dataListeners.points.isPrimary(),
    'extraDependency: points is primary'
  ).toBe(true);
  expect(
    ranking.dataListeners.lostpoints.isPrimary(),
    'extraDependency: lostpoints is primary'
  ).toBe(true);
  ranking = new RankingModel(['numgames', 'wins', 'saldo', 'points'], 5);
  listener.reset();
  ranking.registerListener(listener);
  ref = {
    components: ['numgames', 'wins', 'saldo', 'points'],
    ids: [0, 1, 2, 3, 4],
    ranks: [0, 0, 0, 0, 0],
    displayOrder: [0, 1, 2, 3, 4],
    numgames: [0, 0, 0, 0, 0],
    wins: [0, 0, 0, 0, 0],
    saldo: [0, 0, 0, 0, 0],
    points: [0, 0, 0, 0, 0]
  };
  rankingobject = ranking.get();
  expect(rankingobject, 'ranking.get works').toBeTruthy();
  expect(rankingobject, 'empty ranking is not empty').toEqual(ref);
  ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [13, 7]));
  ref = {
    components: ['numgames', 'wins', 'saldo', 'points'],
    ids: [0, 1, 2, 3, 4],
    ranks: [2, 0, 2, 1, 2],
    displayOrder: [1, 3, 0, 2, 4],
    numgames: [0, 1, 0, 1, 0],
    wins: [0, 1, 0, 0, 0],
    saldo: [0, 6, 0, -6, 0],
    points: [0, 13, 0, 7, 0]
  };
  rankingobject = ranking.get();
  expect(rankingobject, 'ranking.get works').toBeTruthy();
  expect(rankingobject, 'ranking is correct').toEqual(ref);
  expect(listener.updated, 'result(): update event fired').toBe(1);
  ref = rankingobject;
  listener.reset();
  ranking.invalidate();
  rankingobject = ranking.get();
  expect(rankingobject !== ref, 'invalidate() triggers a recalculation').toBeTruthy();
  expect(listener.updated, 'invalidate(): update event fired').toBe(1);
  listener.reset();
  ranking.result(new MatchResult(new MatchModel([0, 4], 0, 0), [0, 11]));
  rankingobject = ranking.get();
  ref = {
    components: ['numgames', 'wins', 'saldo', 'points'],
    ids: [0, 1, 2, 3, 4],
    ranks: [3, 1, 4, 2, 0],
    displayOrder: [4, 1, 3, 0, 2],
    numgames: [1, 1, 0, 1, 1],
    wins: [0, 1, 0, 0, 1],
    saldo: [-11, 6, 0, -6, 11],
    points: [0, 13, 0, 7, 11]
  };
  expect(rankingobject, 'second ranking is correct').toEqual(ref);
  expect(listener.updated, 'result(): update event fired').toBe(1);
  ref = {
    components: ['wins', 'buchholz', 'finebuchholz', 'points'],
    ids: [0, 1, 2, 3, 4],
    displayOrder: [2, 4, 3, 0, 1],
    ranks: [3, 4, 0, 2, 1],
    wins: [0, 0, 2, 1, 1],
    buchholz: [2, 2, 1, 0, 2],
    finebuchholz: [2, 1, 4, 2, 3],
    points: [3, 5, 26, 13, 24]
  };
  ranking = new RankingModel(['wins', 'buchholz', 'finebuchholz', 'points'], 5);
  expect(ranking.dataListeners.buchholz.isPrimary(), 'buchholz is secondary').toBe(false);
  expect(
    ranking.dataListeners.finebuchholz.isPrimary(),
    'finebuchholz is secondary'
  ).toBe(false);
  expect(ranking.dataListeners.gamematrix.isPrimary(), 'gamematrix is secondary').toBe(false);
  expect(ranking.dataListeners.points.isPrimary(), 'points is primary').toBe(true);
  expect(ranking.dataListeners.wins.isPrimary(), 'wins is primary').toBe(true);
  expect(ranking.dataListeners.winsmatrix.isPrimary(), 'winsmatrix is primary').toBe(true);
  ranking.result(new MatchResult(new MatchModel([0, 4], 0, 0), [3, 13]));
  ranking.result(new MatchResult(new MatchModel([1, 2], 0, 0), [5, 13]));
  ranking.result(new MatchResult(new MatchModel([3, 0], 0, 0), [13, 0]));
  ranking.result(new MatchResult(new MatchModel([4, 2], 0, 0), [11, 13]));
  rankingobject = ranking.get();
  expect(rankingobject, 'finebuchholz ranking is correct').toEqual(ref);
  ranking = new RankingModel(['numgames', 'wins'], 5);
  ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [13, 0]));
  ranking.result(new MatchResult(new MatchModel([2, 4], 0, 0), [0, 13]));
  ref = {
    components: ['numgames', 'wins'],
    ids: [0, 1, 2, 3, 4],
    ranks: [4, 0, 2, 2, 0],
    displayOrder: [1, 4, 2, 3, 0],
    numgames: [0, 1, 1, 1, 1],
    wins: [0, 1, 0, 0, 1]
  };
  rankingobject = ranking.get();
  expect(rankingobject, 'ranks order is correct').toEqual(ref);

  /*
   * bye()
   */
  ranking = new RankingModel(['numgames', 'wins', 'points', 'lostpoints', 'saldo', 'buchholz', 'finebuchholz'], 5);
  ranking.bye(2);
  ref = {
    components: ['numgames', 'wins', 'points', 'lostpoints', 'saldo', 'buchholz', 'finebuchholz'],
    ids: [0, 1, 2, 3, 4],
    ranks: [1, 1, 0, 1, 1],
    displayOrder: [2, 0, 1, 3, 4],
    numgames: [0, 0, 1, 0, 0],
    wins: [0, 0, 1, 0, 0],
    points: [0, 0, 13, 0, 0],
    lostpoints: [0, 0, -7, 0, 0],
    saldo: [0, 0, 6, 0, 0],
    buchholz: [0, 0, 0, 0, 0],
    finebuchholz: [0, 0, 0, 0, 0]
  };
  rankingobject = ranking.get();
  expect(rankingobject, 'bye() is applied properly to all basic components').toEqual(ref);
  ranking.bye([0, 1, 3]);
  ref = {
    components: ['numgames', 'wins', 'points', 'lostpoints', 'saldo', 'buchholz', 'finebuchholz'],
    ids: [0, 1, 2, 3, 4],
    ranks: [0, 0, 0, 0, 4],
    displayOrder: [0, 1, 2, 3, 4],
    numgames: [1, 1, 1, 1, 0],
    wins: [1, 1, 1, 1, 0],
    points: [13, 13, 13, 13, 0],
    lostpoints: [-7, -7, -7, -7, 0],
    saldo: [6, 6, 6, 6, 0],
    buchholz: [0, 0, 0, 0, 0],
    finebuchholz: [0, 0, 0, 0, 0]
  };
  rankingobject = ranking.get();
  expect(rankingobject, 'bye() with multiple teams works (all teams receive bye)').toEqual(ref);
  ranking.result(new MatchResult(new MatchModel([3, 1], 0, 0), [13, 7]));
  ref = {
    components: ['numgames', 'wins', 'points', 'lostpoints', 'saldo', 'buchholz', 'finebuchholz'],
    ids: [0, 1, 2, 3, 4],
    ranks: [2, 1, 2, 0, 4],
    displayOrder: [3, 1, 0, 2, 4],
    numgames: [1, 2, 1, 2, 0],
    wins: [1, 1, 1, 2, 0],
    points: [13, 20, 13, 26, 0],
    lostpoints: [-7, -20, -7, -14, 0],
    saldo: [6, 0, 6, 12, 0],
    buchholz: [0, 2, 0, 1, 0],
    finebuchholz: [0, 1, 0, 2, 0]
  };
  rankingobject = ranking.get();
  expect(rankingobject, 'buchholz and finebuchholz include bye-induced wins').toEqual(ref);

  /*
   * resize()
   */
  ranking.resize(6);
  ref = {
    components: ['numgames', 'wins', 'points', 'lostpoints', 'saldo', 'buchholz', 'finebuchholz'],
    ids: [0, 1, 2, 3, 4, 5],
    ranks: [2, 1, 2, 0, 4, 4],
    displayOrder: [3, 1, 0, 2, 4, 5],
    numgames: [1, 2, 1, 2, 0, 0],
    wins: [1, 1, 1, 2, 0, 0],
    points: [13, 20, 13, 26, 0, 0],
    lostpoints: [-7, -20, -7, -14, 0, 0],
    saldo: [6, 0, 6, 12, 0, 0],
    buchholz: [0, 2, 0, 1, 0, 0],
    finebuchholz: [0, 1, 0, 2, 0, 0]
  };
  rankingobject = ranking.get();
  expect(rankingobject, 'resize() is able to append a team to the ranking').toEqual(ref);
  ranking.resize(3);
  ref = {
    components: ['numgames', 'wins', 'points', 'lostpoints', 'saldo', 'buchholz', 'finebuchholz'],
    ids: [0, 1, 2],
    ranks: [1, 0, 1],
    displayOrder: [1, 0, 2],
    numgames: [1, 2, 1],
    wins: [1, 1, 1],
    points: [13, 20, 13],
    lostpoints: [-7, -20, -7],
    saldo: [6, 0, 6],
    buchholz: [0, 0, 0],
    finebuchholz: [0, 0, 0]
  };
  rankingobject = ranking.get();
  expect(rankingobject, 'resize() shrinks without changing the actual values').toEqual(ref);

  /*
   * reset()
   */
  ranking.reset();
  ref = {
    components: [],
    ids: [],
    displayOrder: [],
    ranks: []
  };
  rankingobject = ranking.get();
  expect(rankingobject, 'reset() restores to an empty ranking').toEqual(ref);
  expect(ranking.length, 'reset() resizes to 0').toEqual(0);
  ranking = new RankingModel(['wins', 'saldo'], 5);
  ranking.bye(3);
  ranking.result(new MatchResult(new MatchModel([2, 0], 0, 0), [13, 8]));
  ranking.result(new MatchResult(new MatchModel([1, 4], 0, 0), [11, 9]));
  savedata = ranking.save();
  expect(savedata, 'save() works').toBeTruthy();

  /*
   * restore
   */
  ranking = new RankingModel();
  expect(ranking.restore(savedata), 'restore() succeeds').toBe(true);
  ret = ranking.get();
  ref = {
    components: ['wins', 'saldo'],
    ids: [0, 1, 2, 3, 4],
    ranks: [4, 2, 1, 0, 3],
    displayOrder: [3, 2, 1, 4, 0],
    wins: [0, 1, 1, 1, 0],
    saldo: [-5, 2, 5, 6, -2]
  };
  expect(ret, 'restore restores the proper stuff').toEqual(ref);

  /**
   * correct
   */
  ranking.correct(new CorrectionModel(
  //
  new MatchResult(new MatchModel([2, 0], 0, 0), [13, 8]),
  //
  new MatchResult(new MatchModel([2, 0], 0, 0), [8, 13])) //
  );
  ref = {
    components: ['wins', 'saldo'],
    ids: [0, 1, 2, 3, 4],
    ranks: [1, 2, 4, 0, 3],
    displayOrder: [3, 0, 1, 4, 2],
    wins: [1, 1, 0, 1, 0],
    saldo: [5, 2, -5, 6, -2]
  };
  ret = ranking.get();
  expect(ret, 'restore restores the proper stuff').toEqual(ref);

  /**
   * restore with a id-only ranking
   */
  ranking = new RankingModel(['id'], 5);
  savedata = ranking.save();
  ranking = new RankingModel();
  ranking.restore(savedata);
  expect(ranking.length, 'restore() of an id-only ranking also restores the length').toBe(5);
  ref = {
    components: ['id'],
    ids: [0, 1, 2, 3, 4],
    ranks: [0, 1, 2, 3, 4],
    displayOrder: [0, 1, 2, 3, 4],
    id: [0, 1, 2, 3, 4]
  };
  expect(ranking.get(), 'id ranking is in correct order').toEqual(ref);
});