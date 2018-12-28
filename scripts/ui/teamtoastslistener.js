/**
 * Emit toasts when a team action is performed in the teams tab, i.e. adding,
 * removing or renaming.
 *
 * @return TeamToastsListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/listener', 'ui/state', 'ui/listcollectormodel',
  'ui/teammodel', 'ui/toast', 'ui/strings'], function (extend, Listener, State,
  ListCollectorModel, TeamModel, Toast, Strings) {
  function TeamToastsListener (emitter) {
    TeamToastsListener.superconstructor.call(this, emitter)
  }
  extend(TeamToastsListener, Listener)

  TeamToastsListener.prototype.onupdate = function (teamlist, event, data) {
    var newname, team, player

    team = data.source
    if (team) {
      player = team.getPlayer(data.id)
      if (player) {
        newname = player.getName()
        return new Toast(Strings.namechanged.replace('%s', newname))
      }
    }
  }

  TeamToastsListener.prototype.oninsert = function (teamlist, event, data) {
    var teamno

    teamno = data.id
    return new Toast(Strings.teamadded.replace('%s', teamno + 1))
  }

  TeamToastsListener.prototype.onremove = function (teamlist, event, data) {
    var teamno

    teamno = data.id
    return new Toast(Strings.teamdeleted.replace('%s', teamno + 1))
  }

  TeamToastsListener.listeners = {}

  TeamToastsListener.init = function () {
    // FIXME move this to the storage file, or associate it somehow otherwise
    TeamToastsListener.listeners.teams = new TeamToastsListener(State.teams)
    TeamToastsListener.listeners.namechange = new TeamToastsListener(
      new ListCollectorModel(State.teams, TeamModel))
  }

  return TeamToastsListener
})
