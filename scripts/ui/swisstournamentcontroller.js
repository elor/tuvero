/**
 * SwissTournamentController
 *
 * @return SwissTournamentController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Controller from '../core/controller.js'
import Listener from '../core/listener.js'
import PropertyValueModel from '../core/propertyvaluemodel.js'

/**
 * Constructor
 *
 * @param view
 *          a SwissTournamentView instance
 */
class SwissTournamentController extends Controller {
  constructor (view) {
    let $mode, tournament, noshuffle
    super(view)
    tournament = this.model.tournament
    noshuffle = this.model.noshuffle
    this.$options = this.view.$view.find('.tournamentoptions')
    $mode = this.$options.find('select.mode')
    $mode.change(function () {
      tournament.setProperty('swissmode', $(this).val())
      $mode.val($(this).val())
      tournament.setProperty('swisstranspose', tournament.getProperty('swissmode') === 'halves')
    })
    Listener.bind(noshuffle, 'update', function () {
      tournament.setProperty('swissshuffle', !noshuffle.get())
    })
    this.initSpecialWinsProperties()
  }

  /**
   * update the visibility and properties
   */
  initSpecialWinsProperties () {
    let modevalue, votesenabled, byeafterbye
    modevalue = new PropertyValueModel(this.model.tournament, 'swissmode')
    votesenabled = new PropertyValueModel(this.model.tournament,
    //
      'enableupdown')
    byeafterbye = new PropertyValueModel(this.model.tournament, 'byeafterbye')
    Listener.bind(modevalue, 'update', function () {
      votesenabled.set(modevalue.get() === 'wins')
      if (!votesenabled.get()) {
        byeafterbye.set(false)
      }
    })
  }
}

export default SwissTournamentController
