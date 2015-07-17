/**
 * TournamentMatchesView
 *
 * @return TournamentMatchesView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './matchview', './listview',
    './teamtableview', './boxview'], function(extend, TemplateView, MatchView,
    ListView, TeamTableView, BoxView) {
  /**
   * Constructor
   *
   * @param model
   * @param $view
   * @param teamlist
   * @param teamsize
   */
  function TournamentMatchesView(model, $view, teamlist, teamsize) {
    TournamentMatchesView.superconstructor.call(this, model, $view, //
    $view.find('.matchview.template, .matchrow.template'));

    this.boxview = new BoxView(this.$view);

    this.$name = this.$view.find('.tournamentname');

    this.$matchlist = this.$view.find('.matchlist');
    this.matchlist = new ListView(this.model.getMatches(), this.$matchlist,
        this.$template.filter('.matchview'), MatchView, teamlist);

    this.$matchtable = this.$view.find('.matchtable');
    this.matchtable = new ListView(this.model.getMatches(), this.$matchtable,
        this.$template.filter('.matchrow'), MatchView, teamlist);

    this.$teamtableview = new TeamTableView(this, teamsize);

    this.updateName();
  }
  extend(TournamentMatchesView, TemplateView);

  TournamentMatchesView.prototype.updateName = function() {
    this.$name.text(this.model.SYSTEM);
  };

  return TournamentMatchesView;
});
