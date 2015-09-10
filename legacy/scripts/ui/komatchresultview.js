/**
 * KOMatchResultView
 *
 * @return KOMatchResultView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './matchresultview', './koline'], function(extend,
    MatchResultView, KOLine) {
  /**
   * Constructor
   *
   * @param model
   *          a MatchResult instance
   * @param $view
   *          the container element
   * @param teamlist
   *          a ListModel of TeamModel instances
   * @param tournament
   *          a TournamentModel instance
   */
  function KOMatchResultView(model, $view, teamlist, tournament, showNames) {
    KOMatchResultView.superconstructor.call(this, model, $view, teamlist,
        tournament);

    // TODO set the match position from its ID
    this.position = undefined;

    // TODO print the KOLine
    this.line = undefined;
  }
  extend(KOMatchResultView, MatchResultView);

  return KOMatchResultView;
});
