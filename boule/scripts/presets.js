/**
 * Boule presets: swiss as played in the PVO, round similar to chess, and ko
 * with a matched cadrage. Point-based rankings.
 *
 * @return Presets
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  var Presets;

  Presets = {
    target: 'boule',
    systems: {
      swiss: {
        ranking: ['wins', 'buchholz', 'finebuchholz', 'headtohead', 'saldo',
            'votes'],
        mode: 'wins'
      },
      ko: {
        mode: 'matched'
      },
      round: {
        ranking: ['wins', 'sonneborn', 'headtohead', 'points']
      }
    },
    ranking: {
      components: ['buchholz', 'finebuchholz', 'points', 'saldo', 'sonneborn',
          'numgames', 'wins', 'headtohead']
    },
    registration: {
      minteamsize: 1,
      maxteamsize: 3,
      teamsizeicon: true
    },
    names: {
      playernameurl: '',
      dbplayername: 'bouleplayers',
      apitoken: 'apitoken',
      teamsfile: 'tuvero-anmeldungen.txt'
    }
  };

  return Presets;
});
