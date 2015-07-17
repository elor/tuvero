/**
 * TournamentHistoryView
 *
 * @return TournamentHistoryView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './matchview', './listview',
    './teamtableview', './boxview', './teamview', 'core/listener'//
], function(extend, TemplateView, MatchView, ListView, TeamTableView, BoxView,
    TeamView, Listener) {
  /**
   * Constructor
   *
   * @param model
   *          a TournamentModel from which all matches are read
   * @param $view
   *          the container
   * @param teamlist
   *          a ListModel of all TeamModels. Is referenced by ID by
   *          model.getHistory()
   * @param teamsize
   *          a ValueModel which represents the number of players in a team
   */
  function TournamentHistoryView(model, $view, teamlist, teamsize) {
    TournamentHistoryView.superconstructor.call(this, model, $view, //
    $view.find('.template'));

    this.boxview = new BoxView(this.$view);

    this.$name = this.$view.find('.tournamentname');
    this.teamlist = teamlist;
    this.teamsize = teamsize;

    this.initMatches();

    this.initVotes();

    this.updateName();
  }
  extend(TournamentHistoryView, TemplateView);

  /**
   * initializes matchlist and matchtable
   */
  TournamentHistoryView.prototype.initMatches = function() {
    this.$matchlist = this.$view.find('.matchlist');
    this.matchlist = new ListView(this.model.getHistory(), this.$matchlist,
        this.$template.filter('.matchview'), MatchView, this.teamlist);

    this.$matchtable = this.$view.find('.matchtable');
    this.matchtable = new ListView(this.model.getHistory(), this.$matchtable,
        this.$template.filter('.matchrow'), MatchView, this.teamlist);

    this.$teamtableview = new TeamTableView(this, this.teamsize);
  };

  /**
   * initialize all vote lists and tables
   */
  TournamentHistoryView.prototype.initVotes = function() {
    var $votetemplate;

    this.$view.find('.votelist').hide();

    $votetemplate = this.$template.filter('.voteview');

    this.votelistmodels = this.model.VOTES.map(function(votetype) {
      var $votes, votelist;

      $votes = this.$view.find('.votelist.' + votetype);
      if ($votes.length === 0) {
        return undefined;
      }

      votelist = this.model.getVotes(votetype);

      // TODO use some shared View, e.g. ListEmptyView, to hide the whole
      // view when the list is empty
      Listener.bind(votelist, 'resize', function(emitter, event, data) {
        if (emitter.length === 0) {
          $votes.hide();
        } else {
          $votes.show();
        }
      });

      if (votelist.length !== 0) {
        $votes.show();
      }

      return new ListView(votelist, $votes, $votetemplate, TeamView,//
      this.teamlist);
    }, this);
  };

  TournamentHistoryView.prototype.updateName = function() {
    this.$name.text(this.model.SYSTEM);
  };

  return TournamentHistoryView;
});