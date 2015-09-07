/**
 * ProgressRowView
 *
 * @return ProgressRowView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './teamview', './listview',
    'core/listener', './matchresultview'], function(extend, TemplateView,
    TeamView, ListView, Listener, MatchResultView) {
  /**
   * Constructor
   */
  function ProgressRowView(matches, $view, teamlist, tournament) {
    var teamno = matches.get(0).getTeamID(0);
    ProgressRowView.superconstructor.call(this, teamlist.get(teamno), $view,
        $view.find('.template'));

    this.ranking = tournament.getRanking();
    this.$rank = this.$view.find('.rank');

    this.teamView = new TeamView(this.model, $view);

    // TODO defer
    this.updatePending = false;
    Listener.bind(this.ranking, 'update', function() {
      if (!this.updatePending) {
        window.setTimeout(this.updateRank.bind(this), 1);
        this.updatePending = true;
      }
    }, this);

    this.matches = new ListView(matches, this.$view, this.$template,
        MatchResultView, teamlist, tournament);

    this.updateRank();
  }
  extend(ProgressRowView, TemplateView);

  ProgressRowView.prototype.updateRank = function() {
    this.updatePending = false;
    this.$rank.text(this.ranking.get().ranks[this.model.getID()] + 1);
  };

  return ProgressRowView;
});
