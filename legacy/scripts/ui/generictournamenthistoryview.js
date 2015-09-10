/**
 * GenericTournamentHistoryView
 *
 * @return GenericTournamentHistoryView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './progresstableview', './kohistoryview'], //
function(extend, View, ProgressTableView, KOHistoryView) {
  var constructors, selectors;

  constructors = {
    swiss: ProgressTableView,
    round: ProgressTableView,
    ko: KOHistoryView
  };

  selectors = {
    swiss: '.progresstable',
    round: '.progresstable',
    ko: '.kotree'
  };

  /**
   * Constructor
   *
   * @param tournament
   *          a TournamentModel instance
   * @param $view
   *          a DOM element
   * @param groups
   *          a ListModel with the group names
   * @param teamlist
   *          a ListModel of TeamModels which are referenced by teamIDs
   * @param teamsize
   *          a ValueModel of the current default team size
   */
  function GenericTournamentHistoryView(tournament, $view, groups, teamlist,
      teamsize) {
    var Constructor, $subview;
    GenericTournamentHistoryView.superconstructor.call(this, undefined, $view);

    this.tournament = tournament;
    if (tournament && selectors[tournament.SYSTEM]
        && constructors[tournament.SYSTEM]) {
      $subview = this.$view.find(selectors[tournament.SYSTEM]);
      $subview.removeClass('hidden');
      // don't display the matchtable on default anymore, since there's a more
      // sophisticated view in place
      $view.addClass('hastable');
      Constructor = constructors[tournament.SYSTEM];
      this.view = new Constructor(tournament, $view, groups, teamlist, //
      teamsize);
    } else {
      this.view = new View(undefined, $view);
    }
  }
  extend(GenericTournamentHistoryView, View);

  GenericTournamentHistoryView.prototype.destroy = function() {
    this.view.destroy();
    GenericTournamentHistoryView.superclass.destroy.call(this);
  };

  return GenericTournamentHistoryView;
});
