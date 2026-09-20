/**
 * MeleeTournamentView
 *
 * Adds the one thing a Supermêlée can be configured with: whether
 * the drawn line-ups are doublettes or triplettes. The size is read
 * before every draw, so it can still be changed between rounds.
 *
 * @return MeleeTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import TournamentView from './tournamentview.js'

class MeleeTournamentView extends TournamentView {
  constructor (model, $view, tournaments) {
    super(model, $view, tournaments)
    this.$teamsize = this.$view.find('select.meleeteamsize')
    this.$teamsize.val(String(model.getProperty('meleeteamsize')))
    const $teamsize = this.$teamsize
    this.$teamsize.on('change', function () {
      const size = Number($(this).val())
      model.setProperty('meleeteamsize', size)
      // the option exists once per tournament state, keep them in sync
      $teamsize.val(String(size))
    })
  }
}

export default MeleeTournamentView
