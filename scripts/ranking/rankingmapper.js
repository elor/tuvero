import Model from '../core/model.js';

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance with internal ids
 * @param teams
 *          a ListModel instance which maps internal to external ids
 */
class RankingMapper extends Model {
  constructor(ranking, teams) {
    super();
    this.cache = undefined;
    this.ranking = ranking;
    this.teams = teams;
    ranking.registerListener(this);
  }

  /**
   * get the cached ranking or rebuild it if invalidated
   *
   * @return a ranking object
   */
  get() {
    if (this.cache === undefined) {
      RankingMapper.updateCache.call(this);
    }
    return this.cache;
  }

  /**
   * force a rebuild of the ranking object (mapping only)
   */
  invalidate() {
    this.cache = undefined;
  }

  /**
   * callback function
   */
  onupdate() {
    this.invalidate();
    this.emit('update');
  }

  /**
   * translate internal ids (pos) to external ids
   *
   * @param rankingcomponent
   *          an array of internal ids, i.e. positions
   * @param map
   *          a ListModel instance which maps positions to values
   * @return an array of re-mapped ids
   */
  static translateIDs(rankingcomponent, map) {
    return rankingcomponent.map(function (pos) {
      return map.get(pos);
    });
  }

  /**
   * read a ranking object with internal ids and map all internal ids to
   * external ids. Remapping should only be performed on
   * ranking.get().displayOrder
   */
  static updateCache() {
    let ranks, newcache;
    ranks = this.ranking.get();
    newcache = {};
    Object.keys(ranks).forEach(function (key) {
      let values;
      if (key === 'ids') {
        values = RankingMapper.translateIDs(ranks[key], this.teams);
      } else {
        values = ranks[key].slice(0);
      }
      newcache[key] = values;
    }, this);
    this.cache = newcache;
  }
}

export default RankingMapper;