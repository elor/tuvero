/**
 * KOMatchResultView
 *
 * @return KOMatchResultView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import MatchResultView from './matchresultview.js';
import KOTreePosition from './kotreeposition.js';
/**
 * Constructor
 *
 * @param model
 *          a MatchResult instance
 * @param $view
 *          the container element
 * @param teamlist
 *          a ListModel of TeamModel instances
 * @param tournament
 *          a TournamentModel instance
 * @param fullwidth {ValueModel}
 *          whether a name is shown
 * @returns {undefined}
 */
function KOMatchResultView(model, $view, teamlist, tournament, fullwidth) {
  KOMatchResultView.superconstructor.call(this, model, $view, teamlist, tournament);
  this.tournament = tournament;
  this.fullwidth = fullwidth;
  this.reposition();
  fullwidth.registerListener(this);
}
extend(KOMatchResultView, MatchResultView);
KOMatchResultView.prototype.reposition = function () {
  var pos = new KOTreePosition(this.model.getID(), this.model.getGroup(), this.tournament.getTeams().length, this.fullwidth.get());
  this.x = pos.x;
  this.y = pos.y;
  this.$view.css('left', this.x + 'em');
  this.$view.css('top', this.y + 'em');
};
KOMatchResultView.prototype.onupdate = function () {
  this.reposition();
};
export default KOMatchResultView;