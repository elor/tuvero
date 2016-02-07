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
    target: 'basic',
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
      maxteamsize: 1,
      teamsizeicon: false
    },
    names: {
      playernameurl: '',
      dbname: 'tuverobasic',
      dbplayername: 'tuverobasicplayers',
      savefile: 'tuvero.json',
      csvfile: 'tuvero.csv',
      teamsfile: 'tuvero-voranmeldung.txt'
    }
  };

  return Presets;
});
