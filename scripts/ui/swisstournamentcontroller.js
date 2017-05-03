/**
 * SwissTournamentController
 *
 * @return SwissTournamentController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/controller', 'core/listener',
    'core/propertyvaluemodel'], function($, extend, Controller, Listener,
    PropertyValueModel) {
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

    this.initSpecialWinsProperties();
  }
  extend(SwissTournamentController, Controller);

  /**
   * update the visibility and properties
   */
  SwissTournamentController.prototype.initSpecialWinsProperties = function() {
    var modevalue, votesenabled;

    modevalue = new PropertyValueModel(this.model.tournament, 'swissmode');
    votesenabled = new PropertyValueModel(this.model.tournament, //
    'enableupdown');
    byeafterbye = new PropertyValueModel(this.model.tournament, 'byeafterbye');

    Listener.bind(modevalue, 'update', function() {
      votesenabled.set(modevalue.get() === 'wins');
      if (!votesenabled.get()) {
        byeafterbye.set(false);
      }
    });
  };

  return SwissTournamentController;
});
