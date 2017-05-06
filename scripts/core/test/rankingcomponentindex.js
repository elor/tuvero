/**
 * RankingComponentIndex class tests
 *
 * @return RankingComponentIndex
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  return function(QUnit, getModule) {
    var RankingComponentIndex;

    RankingComponentIndex = getModule('core/rankingcomponentindex');
    Type = getModule('core/type');

    QUnit.test('RankingComponentIndex', function() {
      var chain, ranking, components, chainlength;

      ranking = {};
      components = [];

      chain = RankingComponentIndex.createComponentChain(ranking, components);
      QUnit.equal(chain, undefined, 'chain creation fails without components');

      components = ['id'];
      chain = RankingComponentIndex.createComponentChain(ranking, components);
      QUnit.equal(Type(chain), 'object', 'id: chain created');
      QUnit.deepEqual(chain.dependencies, [], 'id: no dependencies');

      components = ['points'];
      chain = RankingComponentIndex.createComponentChain(ranking, components);
      QUnit.equal(Type(chain), 'object', 'points: chain created');
      QUnit.deepEqual(chain.dependencies, ['points'], 'points dependency');

      components = ['wins'];
      chain = RankingComponentIndex.createComponentChain(ranking, components);
      QUnit.equal(Type(chain), 'object', 'wins: chain created');
      QUnit.deepEqual(chain.dependencies, ['wins'], 'wins dependency');

      // Note to self: There's no need to test every single component HERE.
      // There should be complete ranking tests for that

      components = 'numgames,wins,points'.split(',');
      chain = RankingComponentIndex.createComponentChain(ranking, components);
      QUnit.equal(Type(chain), 'object', 'multiple: chain created');
      QUnit.deepEqual(chain.dependencies, ['points', 'wins', 'numgames'],
          'multiple dependencies, correct order.');
      chainlength = 0;
      while (chain) {
        chainlength += 1;
        chain = chain.nextcomponent;
      }
      QUnit.equal(chainlength, components.length + 1,
          'chain has correct length (components.length + DUMMYCOMPONENT)');

      components = 'numgames,wtfisthis,points'.split(',');
      chain = RankingComponentIndex.createComponentChain(ranking, components);
      QUnit.equal(chain, undefined, 'create aborts on unknown component');
    });
  };
});
