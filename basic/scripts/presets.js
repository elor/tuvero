/**
 * Basic presets: swiss direct matchings, round similar to chess, and ko
 * with a matched cadrage. Simple rankings
 *
 * @return Presets
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

const Presets = {
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
    placement: {},
    melee: {
      ranking: ['wins', 'saldo', 'points'],
      teamsize: 2
    }
  },
  ranking: {
    components: ['buchholz', 'finebuchholz', 'points', 'saldo', 'sonneborn', 'numgames', 'wins', 'headtohead', 'threepoint', 'twopoint']
  },
  taboptions: {
    // a basic team is identified by its name; who plays for it is
    // detail that can be switched on when it matters
    showteamname: true,
    shownames: false
  },
  registration: {
    defaultteamsize: 1,
    minteamsize: 1,
    maxteamsize: 3,
    teamsizeicon: false,
    // the team name carries the registration here; player names are
    // hidden by default and can be filled in later
    playernamesoptional: true
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
export default Presets
