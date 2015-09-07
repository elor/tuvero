/**
 * GenericTournamentHistoryView
 *
 * @return GenericTournamentHistoryView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './progresstableview'], function(extend,
    View, ProgressTableView) {
  var constructors, selectors;

  constructors = {
    swiss: ProgressTableView,
    round: ProgressTableView
  };

  selectors = {
    swiss: '.progresstable',
    round: '.progresstable'
  };

  /**
   * Constructor
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
