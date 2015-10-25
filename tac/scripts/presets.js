/**
 * TAC Presets: TAC rankings, followed by wins and numgames
 *
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
        ranking: ['tac', 'numgames', 'wins'],
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
      components: ['tac', 'numgames', 'wins']
    }
  };

  return Presets;
});
