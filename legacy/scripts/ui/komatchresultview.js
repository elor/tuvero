/**
 * KOMatchResultView
 *
 * @return KOMatchResultView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './matchresultview', 'jquery', './koline',
    './kotreeposition'], function(extend, MatchResultView, $, KOLine,
    KOTreePosition) {
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

    this.tournament = tournament;
    this.showNames = showNames;

    this.reposition();

    showNames.registerListener(this);
  }
  extend(KOMatchResultView, MatchResultView);

  KOMatchResultView.prototype.reposition = function() {
    var pos = new KOTreePosition(this.model.getID(), this.model.getGroup(),
        this.tournament.getTeams().length, this.showNames.get());

    this.x = pos.x;
    this.y = pos.y;

    this.$view.css('left', this.x + 'em');
    this.$view.css('top', this.y + 'em');
  };

  KOMatchResultView.prototype.onupdate = function() {
    this.reposition();
  };

  return KOMatchResultView;
});
