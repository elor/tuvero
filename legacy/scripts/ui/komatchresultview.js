/**
 * KOMatchResultView
 *
 * @return KOMatchResultView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './matchresultview', './koline', './kotreeposition'], //
function(extend, MatchResultView, KOLine, KOTreePosition) {
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
    var pos;
    KOMatchResultView.superconstructor.call(this, model, $view, teamlist,
        tournament);

    pos = new KOTreePosition(this.model.getID(), this.model.getGroup(),
        tournament.getTeams().length);

    this.x = pos.x;
    this.y = pos.y;

    this.$view.css('left', this.x + 'em');
    this.$view.css('top', this.y + 'em');

    // TODO print the KOLine
    this.line = undefined;
  }
  extend(KOMatchResultView, MatchResultView);

  return KOMatchResultView;
});
