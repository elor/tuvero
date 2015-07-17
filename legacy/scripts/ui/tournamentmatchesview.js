/**
 * TournamentMatchesView
 *
 * @return TournamentMatchesView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './matchview', './listview'], function(
    extend, TemplateView, MatchView, ListView) {
  /**
   * Constructor
   *
   * @param model
   * @param $view
   * @param teamlist
   */
  function TournamentMatchesView(model, $view, teamlist) {
    TournamentMatchesView.superconstructor.call(this, model, $view, //
    $view.find('.matchview.template'));

    this.$name = this.$view.find('.tournamentname');

    this.$matchlist = this.$view.find('.matchlist');
    this.matchlist = new ListView(this.model.getMatches(), this.$matchlist,
        this.$template, MatchView, teamlist);

    this.updateName();
  }
  extend(TournamentMatchesView, TemplateView);

  TournamentMatchesView.prototype.updateName = function() {
    this.$name.text(this.model.SYSTEM);
  };

  return TournamentMatchesView;
});
