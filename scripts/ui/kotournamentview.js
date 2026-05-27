import TournamentView from './tournamentview.js'
import ValueModel from '../core/valuemodel.js'
import CheckBoxView from './checkboxview.js'
import KOTournamentController from './kotournamentcontroller.js'

/**
 * Constructor
 *
 * @param model
 *          a RoundTournamentModel instance
 * @param $view
 *          a DOM element to fill
 */
class KOTournamentView extends TournamentView {
  constructor (model, $view, tournaments) {
    super(model, $view, tournaments)

    // set the initial value of the ValueModel
    this.model.initialByes = new ValueModel(this.model.tournament.getProperty('initialbyes'))
    // use checkboxes
    this.initialbyescheckboxview = new CheckBoxView(this.model.initialByes,
    //
      this.$view.find('.initial .tournamentoptions .option input.initialbyes'))

    // read the ko mode
    this.$view.find('.tournamentoptions .option select.mode').val(this.model.tournament.getProperty('komode'))
    this.subcontroller = new KOTournamentController(this)
  }
}

export default KOTournamentView
