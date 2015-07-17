/**
 * TournamentMatchesView
 *
 * @return TournamentMatchesView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './matchview', './listview',
    './teamtableview', './boxview', './teamview'], function(extend,
    TemplateView, MatchView, ListView, TeamTableView, BoxView, TeamView) {
  /**
   * Constructor
   *
   * @param model
   *          a TournamentModel from which all matches are read
   * @param $view
   *          the container
   * @param teamlist
   *          a ListModel of all TeamModels. Is referenced by ID by
   *          model.getMatches()
   * @param teamsize
   *          a ValueModel which represents the number of players in a team
   */
  function TournamentMatchesView(model, $view, teamlist, teamsize) {
    TournamentMatchesView.superconstructor.call(this, model, $view, //
    $view.find('.matchview.template, .matchrow.template'));

    this.boxview = new BoxView(this.$view);

    this.$name = this.$view.find('.tournamentname');
    this.teamlist = teamlist;
    this.teamsize = teamsize;

    this.initMatches();

    this.initVotes();

    this.updateName();
  }
  extend(TournamentMatchesView, TemplateView);

  /**
   * initializes matchlist and matchtable
   */
  TournamentMatchesView.prototype.initMatches = function() {
    this.$matchlist = this.$view.find('.matchlist');
    this.matchlist = new ListView(this.model.getMatches(), this.$matchlist,
        this.$template.filter('.matchview'), MatchView, this.teamlist);

    this.$matchtable = this.$view.find('.matchtable');
    this.matchtable = new ListView(this.model.getMatches(), this.$matchtable,
        this.$template.filter('.matchrow'), MatchView, this.teamlist);

    this.$teamtableview = new TeamTableView(this, this.teamsize);
  };

  /**
   * initialize all vote lists and tables
   */
  TournamentMatchesView.prototype.initVotes = function() {
    var $template;

    $template = this.$view.find('.voteview.template').detach();

    this.votelistmodels = this.model.VOTES.map(function(votetype) {
      var $votes;

      $votes = this.$view.find('.votes .' + votetype);
      if ($votes.length === 0) {
        return undefined;
      }

      return new ListView(this.model.getVotes(votetype), $votes, $template,
          TeamView, this.teamlist);
    }, this);
  };

  TournamentMatchesView.prototype.updateName = function() {
    this.$name.text(this.model.SYSTEM);
  };

  return TournamentMatchesView;
});
