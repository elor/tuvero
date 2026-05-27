/**
 * KOTournamentController
 *
 * @return KOTournamentController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Controller from '../core/controller.js'
import Listener from '../core/listener.js'

/**
 * Constructor
 *
 * @param view
 *          a SwissTournamentView instance
 */
class KOTournamentController extends Controller {
  constructor (view) {
        super(view)
    const tournament = this.model.tournament
    const initialByes = this.model.initialByes
    this.$options = this.view.$view.find('.tournamentoptions')
    const $mode = this.$options.find('select.mode')
    $mode.change(function () {
      tournament.setProperty('komode', $(this).val())
      $mode.val($(this).val())
    })
    Listener.bind(initialByes, 'update', function () {
      tournament.setProperty('initialbyes', initialByes.get())
    })
  }
}

export default KOTournamentController
