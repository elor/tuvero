import View from '../core/view.js'
import Type from '../core/type.js'
import TeamController from './teamcontroller.js'

class TeamView extends View {
  constructor (model, $view, teamlist) {
    if (Type.isNumber(model) && teamlist !== undefined) {
      model = teamlist.get(model)
    }
    super(model, $view)
    this.teamController = new TeamController(this)
    this.update()
  }

  update () {
    let $names, i, $name, $teamno, player, $rankingpoints, $teamname
    $teamno = this.$view.find('.teamno')
    if ($teamno.length === 0) {
      $teamno = this.$view.filter('.teamno')
    }
    $teamno.text(this.model.getNumber())
    $teamname = this.$view.find('.teamname')
    if ($teamname.length === 0) {
      $teamname = this.$view.filter('.teamname')
    }
    $teamname.text(this.model.getName())
    $rankingpoints = this.$view.find('.rankingpoints')
    $rankingpoints.text(this.model.rankingpoints)
    $names = this.$view.find('.name')
    if ($names.length === 0) {
      $names = this.$view.filter('.name')
    }

    // FIXME read maxteamsize from options or something
    for (i = 0; i < 3; i += 1) {
      $name = $names.eq(i)
      player = this.model.getPlayer(i)
      if (player) {
        $name.text(player.getName())
      } else {
        $name.remove()
      }
    }
  }

  onupdate () {
    this.update()
  }

  static bindTeamList (teamlist) {
    class IndexTeamView extends TeamView {
      constructor (teamID, $view) {
        super(teamlist.get(teamID), $view)
      }
    }

    return IndexTeamView
  }

  static destroy () {
    this.teamController.destroy()
    super.destroy()
  }
}

export default TeamView
