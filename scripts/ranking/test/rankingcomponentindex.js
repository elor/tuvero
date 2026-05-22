/**
 * RankingComponentIndex class tests
 *
 * @return RankingComponentIndex
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import RankingComponentIndex from '../rankingcomponentindex.js';
import Type from '../../core/type.js';
test('RankingComponentIndex', () => {
  var chain, ranking, components, chainlength;
  ranking = {};
  components = [];
  chain = RankingComponentIndex.createComponentChain(ranking, components);
  expect(chain, 'chain creation fails without components').toBe(undefined);
  components = ['id'];
  chain = RankingComponentIndex.createComponentChain(ranking, components);
  expect(Type(chain), 'id: chain created').toBe('object');
  expect(chain.dependencies, 'id: no dependencies').toEqual([]);
  components = ['points'];
  chain = RankingComponentIndex.createComponentChain(ranking, components);
  expect(Type(chain), 'points: chain created').toBe('object');
  expect(chain.dependencies, 'points dependency').toEqual(['points']);
  components = ['wins'];
  chain = RankingComponentIndex.createComponentChain(ranking, components);
  expect(Type(chain), 'wins: chain created').toBe('object');
  expect(chain.dependencies, 'wins dependency').toEqual(['wins']);

  // Note to self: There's no need to test every single component HERE.
  // There should be complete ranking tests for that

  components = 'numgames,wins,points'.split(',');
  chain = RankingComponentIndex.createComponentChain(ranking, components);
  expect(Type(chain), 'multiple: chain created').toBe('object');
  expect(chain.dependencies, 'multiple dependencies, correct order.').toEqual(['points', 'wins', 'numgames']);
  chainlength = 0;
  while (chain) {
    chainlength += 1;
    chain = chain.nextcomponent;
  }
  expect(
    chainlength,
    'chain has correct length (components.length + DUMMYCOMPONENT)'
  ).toBe(components.length + 1);
  components = 'numgames,wtfisthis,points'.split(',');
  chain = RankingComponentIndex.createComponentChain(ranking, components);
  expect(chain, 'create aborts on unknown component').toBe(undefined);
});