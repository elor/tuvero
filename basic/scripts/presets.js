/**
 * Basic presets: swiss direct matchings, round similar to chess, and ko
 * with a matched cadrage. Simple rankings
 *
 * @return Presets
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(function () {
  var Presets

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
      },
      placement: {}
    },
    ranking: {
      components: ['buchholz', 'finebuchholz', 'points', 'saldo', 'sonneborn',
        'numgames', 'wins', 'headtohead', 'threepoint', 'twopoint'
      ]
    },
    registration: {
      defaultteamsize: 1,
      minteamsize: 1,
      maxteamsize: 3,
      teamsizeicon: false
    },
    names: {
      playernameurl: '',
      dbplayername: 'tuverobasicplayers',
      apitoken: 'apitoken',
      teamsfile: 'tuvero-anmeldungen.txt'
    },
    ui: {
      rankingpoints: false
    }
  }

  return Presets
})
