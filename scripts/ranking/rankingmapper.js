/**
 * RankingMapper: map internal team ids to external team ids, listen to and emit
 * update events, provide a get() function and cache the ranking results for
 * better performance.
 *
 * @return RankingMapper
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model'], function(extend, Model) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance with internal ids
   * @param teams
   *          a ListModel instance which maps internal to external ids
   */
  function RankingMapper(ranking, teams) {
    RankingMapper.superconstructor.call(this);

    this.cache = undefined;
    this.ranking = ranking;
    this.teams = teams;

    ranking.registerListener(this);
  }
  extend(RankingMapper, Model);

  /**
   * translate internal ids (pos) to external ids
   *
   * @param rankingcomponent
   *          an array of internal ids, i.e. positions
   * @param map
   *          a ListModel instance which maps positions to values
   * @return an array of re-mapped ids
   */
  RankingMapper.translateIDs = function(rankingcomponent, map) {
    return rankingcomponent.map(function(pos) {
      return map.get(pos);
    });
  };

  /**
   * read a ranking object with internal ids and map all internal ids to
   * external ids. Remapping should only be performed on
   * ranking.get().displayOrder
   */
  RankingMapper.updateCache = function() {
    var ranks, newcache;

    ranks = this.ranking.get();
    newcache = {};

    Object.keys(ranks).forEach(function(key) {
      var values;

      if (key === 'ids') {
        values = RankingMapper.translateIDs(ranks[key], this.teams);
      } else {
        values = ranks[key].slice(0);
      }

      newcache[key] = values;
    }, this);

    this.cache = newcache;
  };

  /**
   * get the cached ranking or rebuild it if invalidated
   *
   * @return a ranking object
   */
  RankingMapper.prototype.get = function() {
    if (this.cache === undefined) {
      RankingMapper.updateCache.call(this);
    }

    return this.cache;
  };

  /**
   * force a rebuild of the ranking object (mapping only)
   */
  RankingMapper.prototype.invalidate = function() {
    this.cache = undefined;
  };

  /**
   * callback function
   */
  RankingMapper.prototype.onupdate = function() {
    this.invalidate();
    this.emit('update');
  };

  return RankingMapper;
});
