/**
 * Controller for adding a new player and handling invalid player names on input
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Controller from '../core/controller.js'
import PlayerModel from './playermodel.js'
import TeamModel from './teammodel.js'
import State from './state.js'
import TabsHandle from './tabshandle.js'

class NewTeamController extends Controller {
  constructor (view) {
    super(view)
    this.$players = this.view.$players
    this.$teamname = this.view.$teamname
    this.$rankingpoints = this.view.$rankingpoints
    this.view.$view.find('input').keydown(this.filterEnterKeyDown.bind(this))
    this.view.$button.click(this.createNewTeam.bind(this))
    this.view.$advanced.click(this.createAdvanced.bind(this))
  }

  readPlayerNames () {
        const names = this.$players.map(function (id, player) {
            const $player = $(player)
      if ($player.prop('disabled')) {
        return undefined
      }
      return $player.val()
    }).get()
    while (names.length > 0 && names[names.length - 1] === undefined) {
      names.pop()
    }
    return names
  }

  filterEnterKeyDown (e) {
    if (e.which === 13) {
      this.createNewTeam()
      e.preventDefault()
      return false
    }
  }

  createPlayers () {
        const names = this.readPlayerNames()
    if (names.length === 0) {
      console.error('NewTeamController: all input fields disabled?')
      return
    }
    return names.map(function (name) {
      return new PlayerModel(name)
    })
  }

  createNewTeam () {
        const players = this.createPlayers()
    if (players.every(function (player) {
      return player.getName() !== PlayerModel.NONAME
    })) {
      const team = new TeamModel(players)
      team.setName(this.$teamname.val())
      team.rankingpoints = Number(this.$rankingpoints.val())
      this.model.push(team)
      this.view.resetFields()
    }
    this.view.focusEmpty()
  }

  createAdvanced () {
        const players = this.createPlayers()
    const team = new TeamModel(players)
    this.model.push(team)
    this.view.resetFields()
    State.focusedteam.set(team)
    TabsHandle.focus('team')
  }
}

export default NewTeamController
