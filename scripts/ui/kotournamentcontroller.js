/**
 * KOTournamentController
 *
 * @return KOTournamentController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/controller', 'core/listener'], function ($, extend,
  Controller, Listener) {
  /**
   * Constructor
   *
   * @param view
   *          a SwissTournamentView instance
   */
  function KOTournamentController (view) {
    var $mode, tournament, initialByes

    KOTournamentController.superconstructor.call(this, view)

    tournament = this.model.tournament
    initialByes = this.model.initialByes

    this.$options = this.view.$view.find('.tournamentoptions')
    $mode = this.$options.find('select.mode')

    $mode.change(function () {
      tournament.setProperty('komode', $(this).val())
      $mode.val($(this).val())
    })

    Listener.bind(initialByes, 'update', function () {
      tournament.setProperty('initialbyes', initialByes.get())
    })
  }
  extend(KOTournamentController, Controller)

  return KOTournamentController
})
