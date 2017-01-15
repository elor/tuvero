/**
 * Test presets. like boule, but with every possible ranking component.
 *
 * @return Presets
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['core/rankingcomponentindex'], function(RankingComponentIndex) {
  var Presets;

  Presets = {
    target: 'test',
    systems: {
      swiss: {
        ranking: ['wins', 'buchholz', 'finebuchholz', 'saldo'],
        mode: 'wins'
      },
      ko: {
        mode: 'matched'
      },
      round: {
        ranking: ['wins', 'sonneborn']
      }
    },
    ranking: {
      components: RankingComponentIndex.components
    },
    registration: {
      minteamsize: 1,
      maxteamsize: 3,
      teamsizeicon: true
    },
    names: {
      playernameurl: '',
      dbplayername: 'testplayers',
      apitoken: 'apitoken',
      teamsfile: 'tuvero-anmeldungen.txt'
    }
  };

  return Presets;
});
