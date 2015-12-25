/**
 * RankingHeadToHeadListener: calculates the (antisymmetric) headtohead from the
 * (asymmetric) winsmatrix by subtracting its transpose from it with a
 * TransposeDifferenceMatrix.
 *
 * @return RankingHeadToHeadListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingdatalistener', './vectormodel',
    './rankingheadtoheadcomponent'], function(extend, RankingDataListener,
    VectorModel, RankingHeadToHeadComponent) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingHeadToHeadListener(ranking) {
    RankingHeadToHeadListener.superconstructor.call(this, ranking,
        new VectorModel());
  }
  extend(RankingHeadToHeadListener, RankingDataListener);

  RankingHeadToHeadListener.NAME = 'headtohead';
  RankingHeadToHeadListener.DEPENDENCIES = ['winsmatrix'];

  RankingHeadToHeadListener.prototype.getRankingComponents = function() {
    var components;

    components = [];

    this.ranking.componentnames.some(function(component) {
      if (component == RankingHeadToHeadComponent.NAME) {
        return true;
      }
      components.push(component);
    });

    return components;
  };

  RankingHeadToHeadListener.prototype.createDummyRanking = function() {
    var components, dummyRanking, RankingModel;

    components = this.ranking.componentnames.slice(0);
    components.splice(components.indexOf(RankingHeadToHeadComponent.NAME));

    RankingModel = require('core/rankingmodel');
    dummyRanking = new RankingModel(components, this.ranking.length);

    Object.keys(this.ranking.dataListeners).forEach(function(name) {
      if (dummyRanking[name]) {
        dummyRanking[name] = this.ranking[name];
      }
    }, this);

    return dummyRanking;
  };

  RankingHeadToHeadListener.prototype.getGroups = function(ranks) {
    var groups = [];

    ranks.ranks.forEach(function(rank, internalid) {
      if (groups[rank] === undefined) {
        groups[rank] = [];
      }

      groups[rank].push(internalid);
    });

    return groups;
  };

  RankingHeadToHeadListener.prototype.calculatePoints = function(groups) {
    this.headtohead.fill(0);

    groups.forEach(function(group) {
      group.forEach(function(teamA) {
        var points = this.headtohead.get(teamA);

        group.forEach(function(teamB) {
          points += this.winsmatrix.get(teamA, teamB);
        }, this);

        this.headtohead.set(teamA, points);
      }, this);
    }, this);
  };

  RankingHeadToHeadListener.prototype.onrecalc = function() {
    var dummyRanking, ranks;

    dummyRanking = this.createDummyRanking();

    ranks = dummyRanking.getNoRecalc();

    groups = this.getGroups(ranks);

    this.calculatePoints(groups);
  };

  return RankingHeadToHeadListener;
});
