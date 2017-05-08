/**
 * ProgressTableView
 *
 * @return ProgressTableView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/templateview', 'ui/listview', 'ui/inlinelistview',
    'ui/teamtableview', 'ui/progressrowview', 'ui/progresslistmodel', 'ui/strings',
    'list/listmodel', 'ui/progressroundview', 'core/listener'], function(extend,
    TemplateView, ListView, InlineListView, TeamTableView, ProgressRowView,
    ProgressListModel, Strings, ListModel, ProgressRoundView, Listener) {
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
    this.$table = $view.find('.progresstable');
    ProgressTableView.superconstructor.call(this, new ProgressListModel(
        tournament), $view, this.$table.find('tr.template,th.template'));

    this.$separator = this.$table.find('th.hidden.separator');

    // progress table rows
    this.listView = new ListView(this.model, this.$table, this.$template
        .filter('.progressrow'), ProgressRowView, teamlist, tournament);

    // teamsize adjustments
    this.teamTableView = new TeamTableView(this.listView, teamsize);

    // table headers for every round
    this.roundHeaderView = new InlineListView(groups.getBinNames(),
        this.$separator, this.$template.filter('.roundcol'), //
        ProgressRoundView);

    // table headers for every ranking component + 'ranks'
    this.rankingComponents = new ListModel();
    this.$headerRow = this.$table.find('.headerrow');
    this.rankingComponentHeaderView = new ListView(this.rankingComponents,
        this.$headerRow, this.$template.filter('.rankcol'));

    // regular update of this.rankingComponents
    this.ranking = tournament.getRanking();
    Listener.bind(this.ranking, 'update', this.updateRankingComponents
        .bind(this));
    this.updateRankingComponents();
  }
  extend(ProgressTableView, TemplateView);

  /**
   * Read the ranking components from tournament.getRanking() and add missing
   * components to the list of components, to be displayed via a ListView
   */
  ProgressTableView.prototype.updateRankingComponents = function() {
    var order = this.ranking.get().components.slice();
    order.push('ranks');

    order.forEach(function(componentName, index) {
      var name = Strings['ranking_medium_' + componentName];

      if (this.rankingComponents.length === index) {
        this.rankingComponents.push(name);
      } else if (this.rankingComponents.get(index) !== name) {
        this.rankingComponents.set(index, name);
      }
    }, this);

    while (this.rankingComponents.length > order.length) {
      this.rankingComponents.pop();
    }
  };

  return ProgressTableView;
});
