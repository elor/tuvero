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
    target: 'tac',
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
      components: ['tac', 'numgames', 'wins', 'headtohead']
    },
    registration: {
      minteamsize: 1,
      maxteamsize: 1,
      teamsizeicon: false
    },
    taboptions: {
      namemaxwidth: false,
      showmatchtables: true
    },
    names: {
      playernameurl: '',
      dbname: 'tactournament',
      dbplayername: 'tacplayers',
      savefile: 'tac.json',
      csvfile: 'tac.csv',
      teamsfile: 'anmeldungen.txt'
    }
  };

  return Presets;
});
