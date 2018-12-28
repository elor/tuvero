/**
 * Controller for adding a new player and handling invalid player names on input
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(['jquery', 'lib/extend', 'core/controller', 'ui/playermodel',
  'ui/teammodel', 'ui/state', 'ui/tabshandle'
], function ($, extend, Controller, PlayerModel, TeamModel, State,
  TabsHandle) {
  function NewTeamController (view) {
    NewTeamController.superconstructor.call(this, view)

    this.$players = this.view.$players
    this.$teamname = this.view.$teamname
    this.$rankingpoints = this.view.$rankingpoints

    this.view.$view.find('input').keydown(this.filterEnterKeyDown.bind(this))
    this.view.$button.click(this.createNewTeam.bind(this))
    this.view.$advanced.click(this.createAdvanced.bind(this))
  }
  extend(NewTeamController, Controller)

  NewTeamController.prototype.readPlayerNames = function () {
    var names

    names = this.$players.map(function (id, player) {
      var $player
      $player = $(player)

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

  NewTeamController.prototype.filterEnterKeyDown = function (e) {
    if (e.which === 13) {
      this.createNewTeam()
      e.preventDefault()
      return false
    }
  }

  NewTeamController.prototype.createPlayers = function () {
    var names

    names = this.readPlayerNames()

    if (names.length === 0) {
      console.error('NewTeamController: all input fields disabled?')
      return
    }

    return names.map(function (name) {
      return new PlayerModel(name)
    })
  }

  NewTeamController.prototype.createNewTeam = function () {
    var team, players

    players = this.createPlayers()

    if (players.every(function (player) {
      return player.getName() !== PlayerModel.NONAME
    })) {
      team = new TeamModel(players)
      team.setName(this.$teamname.val())
      team.rankingpoints = Number(this.$rankingpoints.val())

      this.model.push(team)
      this.view.resetFields()
    }

    this.view.focusEmpty()
  }

  NewTeamController.prototype.createAdvanced = function () {
    var players, team

    players = this.createPlayers()
    team = new TeamModel(players)
    this.model.push(team)
    this.view.resetFields()

    State.focusedteam.set(team)
    TabsHandle.focus('team')
  }

  return NewTeamController
})
