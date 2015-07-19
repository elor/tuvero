/**
 * TournamentHistoryView
 *
 * @return TournamentHistoryView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './matchresultview', './listview',
    './teamtableview', './boxview', './teamview', 'core/listener',
    './correctioncontroller', 'core/listener'], function(extend, TemplateView,
    MatchResultView, ListView, TeamTableView, BoxView, TeamView, Listener,
    CorrectionController, Listener) {
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

    this.$names = this.$view.find('.tournamentname');
    this.teamlist = teamlist;
    this.teamsize = teamsize;

    this.initMatches();
    this.initCorrections();

    Listener.bind(this.model.getName(), 'update', this.updateNames.bind(this));

    this.updateNames();
  }
  extend(TournamentHistoryView, TemplateView);

  /**
   * initializes matchlist and matchtable
   */
  TournamentHistoryView.prototype.initMatches = function() {
    this.$matchlist = this.$view.find('.matchlist');
    this.matchlist = new ListView(this.model.getHistory(), this.$matchlist,
        this.$template.filter('.matchview'), MatchResultView, this.teamlist);

    this.$matchtable = this.$view.find('.matchtable');
    this.matchtable = new ListView(this.model.getHistory(), this.$matchtable,
        this.$template.filter('.matchrow'), MatchResultView, this.teamlist);

    this.$teamtableview = new TeamTableView(this, this.teamsize);
  };

  /**
   * initialize correction fields and click-listeners
   */
  TournamentHistoryView.prototype.initCorrections = function() {
    this.listCorrectionController = new CorrectionController(this.matchlist,
        this.$template.filter('.correct').clone(), this.model);

    this.tableCorrectionController = new CorrectionController(this.matchtable,
        this.$template.filter('.correct').clone(), this.model);
  };

  TournamentHistoryView.prototype.updateNames = function() {
    this.$names.text(this.model.getName().get());
  };

  return TournamentHistoryView;
});
