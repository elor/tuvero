/**
 * KOHistoryView
 *
 * @return KOHistoryView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './listview', './kolistmodel',
    './kotreeview', './matchtableview'], function(extend, TemplateView,
    ListView, KOListModel, KOTreeView, MatchTableView) {
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
   * @param showNames
   *          a ValueModel which evaluates to true if names should be shown
   */
  function KOHistoryView(tournament, $view, groups, teamlist, teamsize,
      showNames) {
    KOHistoryView.superconstructor.call(this, new KOListModel(tournament),
        $view, $view.find('.progressrow.template'));

    this.$kotree = this.$view.find('.kotree').detach();

    // nested ListViews: BinningReferenceListModel is 2D
    this.kotrees = new ListView(this.model, this.$view, this.$kotree,
        KOTreeView, teamlist, tournament, teamsize, showNames);
  }
  extend(KOHistoryView, TemplateView);

  return KOHistoryView;
});
