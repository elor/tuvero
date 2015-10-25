/**
 * Boule presets: swiss as played in the PVO, round similar to chess, and ko
 * with a matched cadrage. Point-based rankings.
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
        ranking: ['wins', 'buchholz', 'finebuchholz', 'saldo', 'votes'],
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
      components: ['buchholz', 'finebuchholz', 'points', 'saldo', 'sonneborn',
          'numgames', 'wins']
    }
  };

  return Presets;
});
