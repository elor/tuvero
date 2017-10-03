/**
 * GenericTournamentHistoryView
 *
 * @return GenericTournamentHistoryView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/progresstableview', 'ui/kohistoryview'], //
function(extend, View, ProgressTableView, KOHistoryView) {
  var types;

  types = {
    swiss: {
      constructor: ProgressTableView,
      selector: '.progresstable',
      showlists: true
    },
    round: {
      constructor: ProgressTableView,
      selector: '.progresstable',
      showlists: true
    },
    ko: {
      constructor: KOHistoryView,
      selector: '.kotree',
      showlists: false
    }
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
   * @param showNames
   *          a ValueModel, which evaluates to true if names should be shown
   */
  function GenericTournamentHistoryView(tournament, $view, groups, teamlist,
      teamsize, showNames) {
    var Constructor, $subview, type;
    GenericTournamentHistoryView.superconstructor.call(this, undefined, $view);

    this.tournament = tournament;
    type = types[tournament.SYSTEM];
    if (tournament && type) {
      $subview = this.$view.find(type.selector);
      $subview.removeClass('hidden');
      // don't display the matchtable on default anymore, since there's a more
      // sophisticated view in place
      $view.addClass('hastable');
      Constructor = type.constructor;
      this.view = new Constructor(tournament, $view, groups, teamlist, //
      teamsize, showNames);
      this.showlists = !!type.showlists;
    } else {
      this.view = new View(undefined, $view);
      this.showlists = true;
    }
  }
  extend(GenericTournamentHistoryView, View);

  GenericTournamentHistoryView.prototype.destroy = function() {
    this.view.destroy();
    GenericTournamentHistoryView.superclass.destroy.call(this);
  };

  return GenericTournamentHistoryView;
});
