/**
 * KOHistoryView
 *
 * @return KOHistoryView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import TemplateView from './templateview.js';
import ListView from './listview.js';
import KOListModel from './kolistmodel.js';
import KOTreeView from './kotreeview.js';
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
   * @param fullwidth
   *          a ValueModel which evaluates to true if names should be shown
   */
function KOHistoryView(tournament, $view, groups, teamlist, teamsize, fullwidth) {
  KOHistoryView.superconstructor.call(this, new KOListModel(tournament), $view, $view.find('.progressrow.template'));
  this.$kotree = this.$view.find('.kotree').detach();

  // nested ListViews: BinningReferenceListModel is 2D
  this.kotrees = new ListView(this.model, this.$view, this.$kotree, KOTreeView, teamlist, tournament, teamsize, fullwidth);
}
extend(KOHistoryView, TemplateView);
export default KOHistoryView;