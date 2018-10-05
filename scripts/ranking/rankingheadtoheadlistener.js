/**
 * RankingHeadToHeadListener: calculates the (antisymmetric) headtohead from the
 * (asymmetric) winsmatrix by subtracting its transpose from it with a
 * TransposeDifferenceMatrix.
 *
 * @return RankingHeadToHeadListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "ranking/rankingdatalistener", "math/vectormodel",
    "ranking/rankingheadtoheadcomponent"], function (extend, RankingDataListener,
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

  RankingHeadToHeadListener.NAME = "headtohead";
  RankingHeadToHeadListener.DEPENDENCIES = ["winsmatrix"];

  /**
   * creates a copy of this.ranking, where the ranking stops just before
   * 'headtohead'
   *
   * @return a RankingModel instance, which is a direct copy of this.ranking,
   *         but stops its ranking just before the 'headtohead' component
   */
  RankingHeadToHeadListener.prototype.createDummyRanking = function () {
    var components, dummyRanking, RankingModel;

    components = this.ranking.componentnames.slice(0);
    components.splice(components.indexOf(RankingHeadToHeadComponent.NAME));

    RankingModel = require("ranking/rankingmodel");
    dummyRanking = new RankingModel(components, this.ranking.length);

    Object.keys(this.ranking.dataListeners).forEach(function (name) {
      if (dummyRanking[name]) {
        dummyRanking[name] = this.ranking[name];
      }
    }, this);

    return dummyRanking;
  };

  /**
   * converts the dummy ranking result to a 2d array of equally-ranked teams
   *
   * @param ranks
   *          the result of dummyRanking.get()
   * @return the 2D array of equally-ranked teams
   */
  RankingHeadToHeadListener.prototype.getGroups = function (ranks) {
    var groups = [];

    ranks.ranks.forEach(function (rank, internalid) {
      if (groups[rank] === undefined) {
        groups[rank] = [];
      }

      groups[rank].push(internalid);
    });

    return groups;
  };

  /**
   * calculates the headtohead ranking for each team and writes them straight to
   * this.headtohead
   *
   * @param groups
   *          the result of getGroups()
   */
  RankingHeadToHeadListener.prototype.calculatePoints = function (groups) {
    this.headtohead.fill(0);

    groups.forEach(function (group) {
      group.forEach(function (teamA) {
        var points = this.headtohead.get(teamA);

        group.forEach(function (teamB) {
          points += this.winsmatrix.get(teamA, teamB);
        }, this);

        this.headtohead.set(teamA, points);
      }, this);
    }, this);
  };

  /**
   * Recalculates the headtohead vector, depending on the ranking with only the
   * previous components.
   *
   * The headtohead value is calculated as the sum of wins against
   * equally-ranked teams
   */
  RankingHeadToHeadListener.prototype.onrecalc = function () {
    var dummyRanking, ranks, groups;

    dummyRanking = this.createDummyRanking();

    ranks = dummyRanking.getNoRecalc();

    groups = this.getGroups(ranks);

    this.calculatePoints(groups);
  };

  return RankingHeadToHeadListener;
});
