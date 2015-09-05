/**
 * TournamentHistoryView
 *
 * @return TournamentHistoryView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './listview', './boxview',
    './teamview', 'core/listener', 'core/listener',
    'core/binningreferencelistmodel', './matchtableview',
    './generictournamenthistoryview'], function(extend, TemplateView, ListView,
    BoxView, TeamView, Listener, Listener, BinningReferenceListModel,
    MatchTableView, GenericTournamentHistoryView) {
  /**
   * Constructor
   *
   * @param model
   *          a TournamentModel from which all matches are read
   * @param $view
   *          the container
   * @param teamlist
   *          a ListModel of all TeamModels. Is referenced by ID by
   *          model.getCombinedHistory()
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

    this.groups = new BinningReferenceListModel(
        this.model.getCombinedHistory(), TournamentHistoryView.groupFilter);

    this.initMatches();
    this.initGenericView();

    Listener.bind(this.model.getName(), 'update', this.updateNames.bind(this));

    this.updateNames();
  }
  extend(TournamentHistoryView, TemplateView);

  TournamentHistoryView.groupFilter = function(matchresult) {
    return matchresult.getGroup();
  };

  /**
   * initializes matchtable
   */
  TournamentHistoryView.prototype.initMatches = function() {
    this.$matchtable = this.$view.find('.matchtable');

    // nested ListViews: BinningReferenceListModel is 2D
    this.matchtable = new ListView(this.groups, this.$view, this.$matchtable,
        MatchTableView, this.$template.filter('.matchrow'), this.teamlist,
        this.$template.filter('.correct'), this.model, this.teamsize);
  };

  TournamentHistoryView.prototype.initGenericView = function() {
    this.genericView = new GenericTournamentHistoryView(this.model, this.$view,
        this.teamlist, this.teamsize);
  };

  TournamentHistoryView.prototype.updateNames = function() {
    this.$names.text(this.model.getName().get());
  };

  return TournamentHistoryView;
});
