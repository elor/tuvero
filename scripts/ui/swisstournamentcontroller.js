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
        super(view)
    const tournament = this.model.tournament
    const noshuffle = this.model.noshuffle
    this.$options = this.view.$view.find('.tournamentoptions')
    const $mode = this.$options.find('select.mode')
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
        const modevalue = new PropertyValueModel(this.model.tournament, 'swissmode')
    const votesenabled = new PropertyValueModel(this.model.tournament,
    //
      'enableupdown')
    const byeafterbye = new PropertyValueModel(this.model.tournament, 'byeafterbye')
    Listener.bind(modevalue, 'update', function () {
      votesenabled.set(modevalue.get() === 'wins')
      if (!votesenabled.get()) {
        byeafterbye.set(false)
      }
    })
  }
}

export default SwissTournamentController
