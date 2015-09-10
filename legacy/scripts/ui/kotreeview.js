/**
 * KOTreeView
 *
 * @return KOTreeView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './listview', './kolistmodel',
    './matchtableview'], function(extend, TemplateView, ListView, KOListModel,
    MatchTableView) {
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
  function KOTreeView(tournament, $view, groups, teamlist, teamsize) {
    KOTreeView.superconstructor.call(this, new KOListModel(tournament), $view,
        $view.find('.progressrow.template'));

    this.$matchtable = this.$view.find('.kotree').detach();

    // nested ListViews: BinningReferenceListModel is 2D
    this.matchtable = new ListView(this.model, this.$view, this.$matchtable,
        MatchTableView, teamlist, tournament, teamsize);
  }
  extend(KOTreeView, TemplateView);

  return KOTreeView;
});
