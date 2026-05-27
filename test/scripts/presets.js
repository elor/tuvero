/**
 * Test presets. like boule, but with every possible ranking component.
 *
 * @return Presets
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import RankingComponentIndex from '../../scripts/ranking/rankingcomponentindex.js'


const Presets = {
  target: 'test',
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
    },
    placement: {},
    poules: {}
  },
  ranking: {
    components: RankingComponentIndex.components
  },
  registration: {
    defaultteamsize: 1,
    minteamsize: 1,
    maxteamsize: 3,
    teamsizeicon: true
  },
  names: {
    playernameurl: '',
    dbplayername: 'testplayers',
    apitoken: 'apitoken',
    teamsfile: 'tuvero-anmeldungen.txt'
  },
  ui: {
    rankingpoints: true
  }
}

export default Presets
