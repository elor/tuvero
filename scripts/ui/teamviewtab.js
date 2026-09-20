/**
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from '../core/view.js'
import ListView from './listview.js'
import State from './state.js'
import TeamModel from './teammodel.js'
import ClassView from '../core/classview.js'
import TeamSettingsView from './teamsettingsview.js'
import PlayerSettingsView from './playersettingsview.js'
import ListModel from '../list/listmodel.js'
import TabsHandle from './tabshandle.js'
import NoRegModel from './noregmodel.js'
import NewTeamView from './newteamview.js'
import TeamMatchesView from './teammatchesview.js'
import NameInputView from './nameinputview.js'
import PlayerModel from './playermodel.js'

class TeamViewTab extends View {
  constructor ($tab) {
    super(undefined, $tab)
    this.players = new ListModel()
    this.init()
    State.focusedteam.registerListener(this)
  }

  /**
   * Rebuild when another team is shown -- not when the team itself
   * changes. Every field here is bound to its own model and follows
   * along on its own; tearing the tab down on a rename would pull
   * the input out from under the person typing in it.
   *
   * @param emitter
   *          what changed: the focus, or the team on display
   */
  onupdate (emitter) {
    if (emitter === State.focusedteam ||
        (this.team && this.players.length !== this.team.players.length)) {
      this.update()
      return
    }
    // the heading carries the team number, which the advanced form
    // can change
    this.updateTeamNo()
  }

  init () {
    let $container
    $container = this.$view.find('.hasteam')
    this.hasnoteam = new ClassView(State.focusedteam, $container, undefined, 'hidden')
    $container = this.$view.find('.hasnoteam')
    this.hasnoteam = new ClassView(State.focusedteam, $container, 'hidden', undefined)

    // registration / next team
    $container = this.$view.find('.newteamview')
    this.newTeamView = new NewTeamView(State.teams, $container, State.teamsize)
    // hide when registration is closed
    this.regVisibilityView = new ClassView(new NoRegModel(State.tournaments), $container, 'hidden')
    $container = this.$view.find('.playersettings')
    const $template = $container.find('.template')
    this.playerlistview = new ListView(this.players, $container, $template, PlayerSettingsView, this)
    this.update()
  }

  update () {
    this.reset()
    if (State.focusedteam.get()) {
      TabsHandle.secret('team')
      this.team = State.focusedteam.get()
      this.team.registerListener(this)
      this.team.players.forEach(function (player) {
        this.players.push(player)
      }, this)
      this.teamSettingsView = new TeamSettingsView(this.team, this.$view.find('.teamsettings'))
      this.initNames()
      this.matchesView = new TeamMatchesView(this.team, this.$view.find('.teammatches'))
      this.updateTeamNo()
    } else {
      TabsHandle.hide('team')
    }
  }

  /**
   * Team name and player names, right at the top: the two things
   * one actually comes here to change.
   */
  initNames () {
    this.nameViews = []
    this.nameViews.push(new NameInputView(this.team,
      this.$view.find('.teamnames input.teamalias'), {
        get: function (team) { return team.alias },
        set: function (team, value) { team.alias = value }
      }))

    const $players = this.$view.find('.teamnames .playernames')
    if (!this.$playernametemplate) {
      // out of the document, or it would show up as a nameless
      // fourth row that takes typing nobody ever reads
      this.$playernametemplate = $players.find('.template.playername').detach()
    }
    const $template = this.$playernametemplate
    $players.empty()
    this.team.players.forEach(function (player, index) {
      const $row = $template.clone().removeClass('template')
      $row.find('.playerlabel').append(' ' + (index + 1))
      $players.append($row)
      this.nameViews.push(new NameInputView(player, $row.find('input.playeralias'), {
        get: function (player) {
          const name = player.getName()
          return name === PlayerModel.NONAME ? '' : name
        },
        set: function (player, value) { player.setName(value) }
      }))
    }, this)
  }

  destroyNames () {
    if (!this.nameViews) {
      return
    }
    this.nameViews.forEach(function (view) {
      view.destroy()
    })
    this.nameViews = undefined
  }

  reset () {
    this.players.clear()
    if (this.team) {
      this.team.unregisterListener(this)
    }
    this.team = new TeamModel()
    if (this.teamSettingsView) {
      this.teamSettingsView.destroy()
      this.teamSettingsView = undefined
    }
    if (this.matchesView) {
      this.matchesView.destroy()
      this.matchesView = undefined
    }
    this.destroyNames()
  }

  updateTeamNo () {
    this.$view.find('.teamno').text(this.team.getNumber())
  }
}

$(function ($) {
  const $tab = $('#tabs > [data-tab="team"]')
  if ($tab.length && $('#testmain').length === 0) {
    return new TeamViewTab($tab)
  }
})
export default TeamViewTab
