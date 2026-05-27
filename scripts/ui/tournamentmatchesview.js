import View from '../core/view.js'
import TemplateView from './templateview.js'
import ListView from './listview.js'
import PopoutBoxView from './popoutboxview.js'
import TeamView from './teamview.js'
import Listener from '../core/listener.js'
import MatchTableView from './matchtableview.js'
import TournamentRenameController from './tournamentrenamecontroller.js'

/**
 * Constructor
 *
 * @param model
 *          a TournamentModel from which all matches are read
 * @param $view
 *          the container
 * @param teamlist
 *          a ListModel of all TeamModels. Is referenced by ID by
 *          model.getMatches()
 * @param teamsize
 *          a ValueModel which represents the number of players in a team
 */
class TournamentMatchesView extends TemplateView {
  constructor (model, $view, teamlist, teamsize) {
    const $popoutTemplate = $view.clone()
    super(model, $view, //
      $view.find('.template.voteview'))
    this.renameController = new TournamentRenameController(new View(model, this.$view.find('.tournamentname.rename')))
    this.boxview = new PopoutBoxView(this.$view, $popoutTemplate, function ($view) {
      return new TournamentMatchesView(model, $view, teamlist, teamsize)
    })
    this.$names = this.$view.find('.tournamentname')
    this.teamlist = teamlist
    this.teamsize = teamsize
    this.initMatches()
    this.initVotes()
    Listener.bind(this.model.getName(), 'update', this.updateNames.bind(this))
    this.updateNames()
  }

  /**
   * initializes matchtable
   */
  initMatches () {
    this.$matchtable = this.$view.find('.matchtable')
    this.matchtable = new MatchTableView(this.model.getMatches(), this.$matchtable, this.teamlist, this.model, this.teamsize)
    Listener.bind(this.model.getMatches(), 'resize', this.updateVisibility.bind(this))
    this.updateVisibility()
  }

  updateVisibility () {
    if (this.model.getMatches().length === 0) {
      this.$view.addClass('hidden')
    } else {
      this.$view.removeClass('hidden')
    }
  }

  /**
   * initialize all vote lists and tables
   */
  initVotes () {
    this.$view.find('.votelist').hide()
    const $votetemplate = this.$template
    this.votelistmodels = this.model.VOTES.map(function (votetype) {
      const $votes = this.$view.find('.votelist.' + votetype)
      if ($votes.length === 0) {
        return undefined
      }
      const votelist = this.model.getVotes(votetype)

      // TODO use some shared View, e.g. ListEmptyView, to hide the whole
      // view when the list is empty
      Listener.bind(votelist, 'resize', function (emitter, event, data) {
        if (emitter.length === 0) {
          $votes.hide()
        } else {
          $votes.show()
        }
      })
      if (votelist.length !== 0) {
        $votes.show()
      }
      return new ListView(votelist, $votes, $votetemplate, TeamView,
      //
        this.teamlist)
    }, this)
  }

  updateNames () {
    this.$names.text(this.model.getName().get())
  }
}

export default TournamentMatchesView
