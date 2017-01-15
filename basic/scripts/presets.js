/**
 * Basic presets: swiss direct matchings, round similar to chess, and ko
 * with a matched cadrage. Simple rankings
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
        ranking: ['wins', 'headtohead', 'saldo'],
        mode: 'ranks'
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
      dbplayername: 'tuverobasicplayers',
      apitoken: 'apitoken',
      teamsfile: 'tuvero-anmeldungen.txt'
    }
  };

  return Presets;
});
