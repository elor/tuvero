/**
 * RankingByeListener
 *
 * TODO: test properly
 *
 * @return RankingByeListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';
/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
function RankingByeListener(ranking) {
  RankingByeListener.superconstructor.call(this, ranking,
  // autoformat
  new VectorModel());
}
extend(RankingByeListener, RankingDataListener);
RankingByeListener.NAME = 'byes';
RankingByeListener.DEPENDENCIES = undefined;

/**
 * accumulate byes
 *
 * @param r
 *          the Emitter, i.e. a RankingModel instance
 * @param e
 *          the event type, i.e. "bye"
 * @param teams
 *          an array of team ids
 */
RankingByeListener.prototype.onbye = function (r, e, data) {
  data.teams.forEach(function (teamid) {
    this.byes.add(teamid, 1);
  }, this);
};
export default RankingByeListener;