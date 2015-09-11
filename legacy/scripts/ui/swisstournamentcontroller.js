/**
 * SwissTournamentController
 *
 * @return SwissTournamentController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/listener'], function(extend,
    Controller, Listener) {
  /**
   * Constructor
   *
   * @param view
   *          a SwissTournamentView instance
   */
  function SwissTournamentController(view) {
    var $mode, $noshuffle, tournament, noshuffle;

    SwissTournamentController.superconstructor.call(this, view);

    tournament = this.model.tournament;
    noshuffle = this.model.noshuffle;

    this.$options = this.view.$view.find('.tournamentoptions');
    $mode = this.$options.find('select.mode');
    $noshuffle = this.$options.find('input.noshuffle');

    $mode.change(function() {
      tournament.setProperty('swissmode', $(this).val());
      $mode.val($(this).val());
      tournament.setProperty('swisstranspose', tournament
          .getProperty('swissmode') === 'halves');
    });

    Listener.bind(noshuffle, 'update', function() {
      tournament.setProperty('swissshuffle', !noshuffle.get());
    });
  }
  extend(SwissTournamentController, Controller);

  return SwissTournamentController;
});
