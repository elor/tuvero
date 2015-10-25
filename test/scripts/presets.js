/**
 * @return Presets
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['core/rankingcomponentindex'], function(RankingComponentIndex) {
  var Presets;

  Presets = {
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
    }
  };

  return Presets;
});
