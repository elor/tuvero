/**
 * @return Presets
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  var Presets;

  Presets = {
    systems: {
      swiss: {
        ranking: ['tac', 'wins', 'numgames'],
        mode: 'ranks'
      },
      ko: {
        mode: 'matched'
      },
      round: {
        ranking: ['tac', 'numgames', 'wins']
      }
    },
    ranking: {
      components: ['tac', 'wins', 'numgames']
    }
  };

  return Presets;
});
