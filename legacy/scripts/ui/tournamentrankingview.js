/**
 * TournamentRankingView
 *
 * @return TournamentRankingView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './rankingview', './listview',
    './popoutboxview', './correctionview', './teamtableview',
    'core/valuemodel', 'core/listener', 'ui/tournamentrenamecontroller'], //
function(extend, View, RankingView, ListView, PopoutBoxView, CorrectionView,
    TeamTableView, ValueModel, Listener, TournamentRenameController) {
  /**
   * Constructor
   *
   * @param model
   *          a TournamentModel instance
   * @param $view
   *          the container of the object
   * @param teams
   *          a ListModel of TeamModel instances which is referenced by index by
   *          TournamentModel.getRanking()
   */
  function TournamentRankingView(model, $view, teams, abbreviate) {
    var $popout = $view.clone();
    TournamentRankingView.superconstructor.call(this, model, $view);

    this.renameController = new TournamentRenameController(new View(model,
        this.$view.find('.tournamentname.rename')));
    this.boxview = new PopoutBoxView(this.$view, $popout, function($view) {
      return new TournamentRankingView(model, $view, teams, abbreviate);
    });

    this.$ranking = this.$view.find('.rankingview');
    this.rankingview = new RankingView(this.model.getRanking(), this.$ranking,
        teams, abbreviate);

    this.$corrections = this.$view.find('.correctiontable');
    this.$correctionrow = this.$corrections.find('.correctionrow.template')
        .detach();
    this.corrections = new ListView(this.model.getCorrections(),
        this.$corrections, this.$correctionrow, CorrectionView);
    this.correctionTeamHideListener = new TeamTableView(this.corrections,
        new ValueModel(3));

    this.$names = this.$view.find('.tournamentname');

    Listener.bind(this.model.getName(), 'update', this.updateNames.bind(this));
    Listener.bind(this.model.getState(), 'update', this.updateVisibility
        .bind(this));

    this.updateNames();
    this.updateVisibility();
  }
  extend(TournamentRankingView, View);

  TournamentRankingView.prototype.updateNames = function() {
    this.$names.text(this.model.getName().get());
  };

  TournamentRankingView.prototype.updateVisibility = function() {
    if (this.model.getState().get() === 'initial') {
      this.$view.addClass('hidden');
    } else {
      this.$view.removeClass('hidden');
    }
  };

  return TournamentRankingView;
});
