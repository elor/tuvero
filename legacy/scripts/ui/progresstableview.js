/**
 * ProgressTableView
 *
 * @return ProgressTableView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './listview', './inlinelistview',
    './teamtableview', './progressrowview', './progresslistmodel',
    './progressroundview'], function(extend, TemplateView, ListView,
    InlineListView, TeamTableView, ProgressRowView, ProgressListModel,
    ProgressRoundView) {
  /**
   * Constructor
   *
   * @param tournament
   *          a TournamentModel instance
   * @param $view
   *          the table
   * @param groups
   *          a BinningReferenceListModel of MatchReferenceModels which are
   *          grouped by their match group
   * @param teamlist
   *          a ListModel of TeamModel instances
   * @param teamsize
   *          a ValueModel which represents the size of all registered teams
   */
  function ProgressTableView(tournament, $view, groups, teamlist, teamsize) {
    ProgressTableView.superconstructor.call(this, new ProgressListModel(
        tournament), $view, $view.find('.progressrow.template'));

    this.$table = this.$view.find('.progresstable');
    this.$roundHeaderTemplate = this.$view.find('th.template');
    this.$header = this.$roundHeaderTemplate.parent();
    this.$roundHeaderTemplate.detach();
    this.$rankHeader = this.$header.find('.rankcol');

    this.listView = new ListView(this.model, this.$table, this.$template,
        ProgressRowView, teamlist, tournament);

    this.teamTableView = new TeamTableView(this.listView, teamsize);

    this.roundHeaderView = new InlineListView(groups.getBinNames(),
        this.$rankHeader, this.$roundHeaderTemplate, ProgressRoundView);
  }
  extend(ProgressTableView, TemplateView);

  return ProgressTableView;
});
