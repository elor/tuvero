/**
 * SwissTournamentView
 *
 * @return SwissTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './tournamentview', './swisstournamentcontroller',
    'core/valuemodel', './checkboxview'], function(extend, TournamentView,
    SwissTournamentController, ValueModel, CheckBoxView) {
  /**
   * Constructor
   *
   * @param model
   *          a SwissTournamentModel instance
   * @param $view
   *          a jquery DOM element
   */
  function SwissTournamentView(model, $view) {
    SwissTournamentView.superconstructor.call(this, model, $view);

    // set noshuffle
    this.model.noshuffle = new ValueModel(!this.model.tournament
        .getProperty('swissshuffle'));
    // use noshuffle checkboxes
    this.noshufflecheckboxview = {
      initial: new CheckBoxView(this.model.noshuffle, this.$view
          .find('.initial .tournamentoptions .option input.noshuffle')),
      idle: new CheckBoxView(this.model.noshuffle, this.$view
          .find('.idle .tournamentoptions .option input.noshuffle'))
    };

    // read the swiss mode
    this.$view.find('.tournamentoptions .option select.mode').val(
        this.model.tournament.getProperty('swissmode'));

    this.subcontroller = new SwissTournamentController(this);
  }
  extend(SwissTournamentView, TournamentView);

  return SwissTournamentView;
});
