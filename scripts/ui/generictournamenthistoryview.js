import View from '../core/view.js'
import ProgressTableView from './progresstableview.js'
import KOHistoryView from './kohistoryview.js'
let types
types = {
  swiss: {
    constructor: ProgressTableView,
    selector: '.progresstable',
    showlists: true
  },
  formulex: {
    constructor: ProgressTableView,
    selector: '.progresstable',
    showlists: true
  },
  round: {
    constructor: ProgressTableView,
    selector: '.progresstable',
    showlists: true
  },
  ko: {
    constructor: KOHistoryView,
    selector: '.kotree',
    showlists: false
  }
}

/**
 * Constructor
 *
 * @param tournament
 *          a TournamentModel instance
 * @param $view
 *          a DOM element
 * @param groups
 *          a ListModel with the group names
 * @param teamlist
 *          a ListModel of TeamModels which are referenced by teamIDs
 * @param teamsize
 *          a ValueModel of the current default team size
 * @param fullwidth
 *          a ValueModel, which evaluates to true if any names should be shown
 */
class GenericTournamentHistoryView extends View {
  constructor (tournament, $view, groups, teamlist, teamsize, fullwidth) {
    let Constructor, $subview, type
    super(undefined, $view)
    this.tournament = tournament
    type = types[tournament.SYSTEM]
    if (tournament && type) {
      $subview = this.$view.find(type.selector)
      $subview.removeClass('hidden')
      // don't display the matchtable on default anymore, since there's a more
      // sophisticated view in place
      $view.addClass('hastable')
      Constructor = type.constructor
      this.view = new Constructor(tournament, $view, groups, teamlist,
      //
        teamsize, fullwidth)
      this.showlists = !!type.showlists
    } else {
      this.view = new View(undefined, $view)
      this.showlists = true
    }
  }

  destroy () {
    this.view.destroy()
    super.destroy()
  }
}

export default GenericTournamentHistoryView
