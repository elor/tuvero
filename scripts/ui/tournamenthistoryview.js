import View from '../core/view.js'
import ListView from './listview.js'
import PopoutBoxView from './popoutboxview.js'
import Listener from '../core/listener.js'
import BinningReferenceListModel from '../list/binningreferencelistmodel.js'
import MatchTableView from './matchtableview.js'
import GenericTournamentHistoryView from './generictournamenthistoryview.js'
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
   *          model.getCombinedHistory()
   * @param teamsize
   *          a ValueModel which represents the number of players in a team
   * @param fullwidth
   *          a ValueModel which evaluates to true if any name should be shown
   */
class TournamentHistoryView extends View {
  constructor (model, $view, teamlist, teamsize, fullwidth) {
    const $popoutTemplate = $view.clone()
    super(model, $view)
    this.renameController = new TournamentRenameController(new View(model, this.$view.find('.tournamentname.rename')))
    this.boxview = new PopoutBoxView(this.$view, $popoutTemplate, function ($view) {
      return new TournamentHistoryView(model, $view, teamlist, teamsize, fullwidth)
    })
    this.$names = this.$view.find('.tournamentname')
    this.teamlist = teamlist
    this.teamsize = teamsize
    this.fullwidth = fullwidth
    this.groups = new BinningReferenceListModel(this.model.getCombinedHistory(), TournamentHistoryView.groupFilter)
    this.initGenericView()
    this.initMatches()
    Listener.bind(this.model.getName(), 'update', this.updateNames.bind(this))
    Listener.bind(this.model.getCombinedHistory(), 'resize', this.updateVisibility.bind(this))
    this.updateVisibility()
    this.updateNames()
  }

  /**
     * initializes matchtable
     */
  initMatches () {
    this.$matchtable = this.$view.find('.matchtable')
    if (this.genericView.showlists) {
      // nested ListViews: BinningReferenceListModel is 2D
      this.matchtable = new ListView(this.groups, this.$view, this.$matchtable, MatchTableView, this.teamlist, this.model, this.teamsize)
      this.$view.addClass('haslists')
    } else {
      this.$matchtable.remove()
      this.matchtable = undefined
    }
  }

  initGenericView () {
    this.genericView = new GenericTournamentHistoryView(this.model, this.$view, this.groups, this.teamlist, this.teamsize, this.fullwidth)
  }

  updateVisibility () {
    if (this.model.getCombinedHistory().length === 0) {
      this.$view.addClass('hidden')
    } else {
      this.$view.removeClass('hidden')
    }
  }

  updateNames () {
    this.$names.text(this.model.getName().get())
  }

  static groupFilter (matchresult) {
    return matchresult.getGroup()
  }
}

export default TournamentHistoryView
