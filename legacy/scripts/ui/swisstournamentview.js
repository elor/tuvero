/**
 * SwissTournamentView
 *
 * @return SwissTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './tournamentview', './swisstournamentcontroller'],//
function(extend, TournamentView, SwissTournamentController) {
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

    this.subcontroller = new SwissTournamentController(this);
  }
  extend(SwissTournamentView, TournamentView);

  return SwissTournamentView;
});
