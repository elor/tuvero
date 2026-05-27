import TemplateView from './templateview.js'
import TeamView from './teamview.js'
import ListView from './listview.js'
import ListModel from '../list/listmodel.js'
import InlineListView from './inlinelistview.js'
import Listener from '../core/listener.js'
import MatchResultView from './matchresultview.js'

/**
 * Constructor
 */
class ProgressRowView extends TemplateView {
  constructor (matches, $view, teamlist, tournament) {
    const teamno = matches.get(0).getTeamID(0)
    super(teamlist.get(teamno), $view, $view.find('.template'))
    this.ranking = tournament.getRanking()
    this.$separator = this.$view.find('.hidden.separator')
    this.rankingList = new ListModel()
    this.teamView = new TeamView(this.model, $view)

    // TODO defer
    this.updatePending = false
    Listener.bind(this.ranking, 'update', function () {
      if (!this.updatePending) {
        window.setTimeout(this.updateRank.bind(this), 1)
        this.updatePending = true
      }
    }, this)
    this.matches = new InlineListView(matches, this.$separator, this.$template.filter('.match'), MatchResultView, teamlist, tournament)
    this.ranks = new ListView(this.rankingList, this.$view, this.$template.filter('.rankingcomponent'))
    this.updateRank()
  }

  updateRank () {
    let ranking, rankIndex, order
    ranking = this.ranking.get()
    rankIndex = ranking.ids.indexOf(this.model.getID())
    order = ranking.components.slice(0)
    order.push('ranks')
    order.forEach(function (component, index) {
      let value = ranking[component][rankIndex]
      if (component === 'ranks') {
        value += 1
      }
      if (this.rankingList.length === index) {
        this.rankingList.push(value)
      } else if (this.rankingList.get(index) !== value) {
        this.rankingList.set(index, value)
      }
    }, this)
    this.updatePending = false
  }
}

export default ProgressRowView
