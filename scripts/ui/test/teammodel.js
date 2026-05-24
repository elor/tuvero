/**
 * Unit tests for TeamModel
 *
 * @return test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import TeamModel from '../teammodel.js';
import IndexedModel from '../../list/indexedmodel.js';
import PlayerModel from '../playermodel.js';
test('TeamModel', () => {
  let team, players, names, listener;
  expect(
    TeamModel.prototype instanceof IndexedModel,
    'TeamModel is subclass of IndexedModel'
  ).toBeTruthy();
  listener = {
    updatecount: 0,
    /**
     * Callback listener
     */
    onupdate: function () {
      listener.updatecount += 1;
    },
    /**
     * counter reset
     */
    reset: function () {
      listener.updatecount = 0;
    },
    emitters: []
  };
  team = new TeamModel();
  expect(team.length, 'empty initialization generates an empty team player').toBe(1);
  expect(
    team.getPlayer(0).getName(),
    'empty initialization generates an default team player name'
  ).toBe(PlayerModel.NONAME);
  expect(team.getID(), 'empty initialization sets id to -1').toBe(-1);
  expect(team.getPlayer(-1), 'getPlayer(-1) returns undefined').toBe(undefined);
  expect(team.getPlayer(5), 'out of bounds getPlayer returns undefined').toBe(undefined);
  names = ['Erik E. Lorenz', 'Fabian Böttcher', 'Detlef Schwede'];
  players = [new PlayerModel(names[0]), new PlayerModel(names[1]), new PlayerModel(names[2])];
  team = new TeamModel(players, 5);
  expect(team.length, 'proper initialization: team length').toBe(players.length);
  expect(team.getID(), 'proper initialization sets id').toBe(5);
  expect(team.getPlayer(0).getName(), 'player name 1').toBe(names[0]);
  expect(team.getPlayer(1).getName(), 'player name 2').toBe(names[1]);
  expect(team.getPlayer(2).getName(), 'player name 3').toBe(names[2]);
  team.registerListener(listener);
  listener.reset();
  players[0].setName('Generic Name');
  players[1].setName('Another Generic Name');
  players[2].setName('Third Generic Name');
  expect(listener.updatecount, 'player name updates propagate through to TeamModel').toBe(3);
});