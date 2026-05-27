import Controller from '../core/controller.js'
import View from '../core/view.js'
import State from './state.js'
import TeamModel from './teammodel.js'
import PlayerModel from './playermodel.js'
import Random from '../core/random.js'
import StateSaver from './statesaver.js'
let rng
rng = new Random()

/**
 * Constructor
 */
class RegisterTeamsController extends Controller {
  constructor ($button, $numteams) {
    super(new View(undefined, $button))
    this.$button = $button
    this.$numteams = $numteams
    $button.click(this.registerTeams.bind(this))
    this.$numteams.keydown(function (e) {
      if (e.which === 13) {
        this.registerTeams()
      }
    }.bind(this))
  }

  registerTeams () {
    let numTeams
    numTeams = Number(this.$numteams.val())
    if (isNaN(numTeams)) {
      return
    }
    if (!StateSaver.canSave()) {
      StateSaver.createNewEmptyTree('Tuvero Test-Turnier')
    }
    for (; numTeams > 0; numTeams -= 1) {
      State.teams.push(RegisterTeamsController.createTeam())
    }
  }

  static createTeam () {
    let players, team
    players = []
    while (players.length < State.teamsize.get()) {
      players.push(new PlayerModel(RegisterTeamsController.randomName()))
    }
    team = new TeamModel(players)
    return team
  }

  static randomName () {
    let first, last, length, i, letters, Letters
    letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ä', 'ö', 'ü', 'ß']
    Letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Ä', 'Ö', 'Ü']
    length = rng.nextInt(6) + 3
    first = ''
    first += rng.pick(Letters)
    for (i = 0; i < length; i++) {
      first += rng.pick(letters)
    }
    length = rng.nextInt(6) + 3
    last = ''
    last += rng.pick(Letters)
    for (i = 0; i < length; i++) {
      last += rng.pick(letters)
    }
    return first + ' ' + last
  }
}

export default RegisterTeamsController
