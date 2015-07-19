/**
 * TournamentRankingView
 *
 * @return TournamentRankingView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './rankingview', './listview',
    './correctionview', './teamtableview', 'core/valuemodel'], function(extend,
    View, RankingView, ListView, CorrectionView, TeamTableView, ValueModel) {
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
  function TournamentRankingView(model, $view, teams) {
    TournamentRankingView.superconstructor.call(this, model, $view);

    this.$ranking = this.$view.find('.rankingview');
    this.rankingview = new RankingView(this.model.getRanking(), this.$ranking,
        teams);

    this.$corrections = this.$view.find('.correctiontable');
    this.$correctionrow = this.$corrections.find('.correctionrow.template')
        .detach();
    this.corrections = new ListView(this.model.getCorrections(),
        this.$corrections, this.$correctionrow, CorrectionView);
    this.correctionTeamHideListener = new TeamTableView(this.corrections,
        new ValueModel(3));

    this.$names = this.$view.find('.tournamentname');

    this.updateNames();
  }
  extend(TournamentRankingView, View);

  TournamentRankingView.prototype.updateNames = function() {
    this.$names.text(this.model.SYSTEM);
  };

  return TournamentRankingView;
});
