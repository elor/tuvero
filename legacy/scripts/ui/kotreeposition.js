/**
 * KOTreePosition
 *
 * @return KOTreePosition
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['core/kotournamentmodel'], function(KOTournamentModel) {
  var leftPadding, topPadding, width, height, shortWidth;

  width = 17;
  shortWidth = 7;
  height = 4;
  topPadding = -1.5;
  leftPadding = 1;

  /**
   * Constructor
   *
   * @param id
   *          a match id
   * @param group
   *          a KO match group
   * @param numTeams
   *          the total number of teams in the tournament
   * @param showNames
   *          whether the boxes should be wide enough to include names
   */
  function KOTreePosition(id, group, numTeams, showNames) {
    this.id = id;
    this.group = group;
    this.numTeams = numTeams;
    this.showNames = showNames;
    this.round = KOTournamentModel.roundOfMatchID(this.id);
    this.isThirdPlace = (this.group & 0x1) === 1;
    this.firstid = KOTournamentModel.firstMatchIDOfRound(this.round);
    this.firstRound = Math.min(//
    KOTournamentModel.initialRoundForTeams(this.numTeams), //
    KOTournamentModel.roundsInGroup(this.group & ~0x1) - 1);

    this.x = this.calcXPosition();
    this.y = this.calcYPosition();
  }

  /**
   * calculate the x position (css: left) from the given parameters
   *
   * @return the x position
   */
  KOTreePosition.prototype.calcXPosition = function() {
    return leftPadding + (this.firstRound - this.round) * this.getWidth();
  };

  KOTreePosition.prototype.getWidth = function() {
    if (this.showNames) {
      return width;
    }
    return shortWidth;
  };

  /**
   * calculate the y position (css: top) from the given parameters
   *
   * @return the y position
   */
  KOTreePosition.prototype.calcYPosition = function() {
    var y, yFactor;

    yFactor = Math.pow(2, this.firstRound - this.round - 1);

    // padding
    y = topPadding;

    // position of first match in this round
    y += height * yFactor;

    // offset from first match in this round
    y += height * 2 * yFactor * (this.id - this.firstid);

    // third place offset
    if (this.isThirdPlace) {
      y += height * 1.5;
    }

    return y;
  };

  /**
   * @return a KOTreePosition instance which represents the position of the
   *         following match in the hierarchy
   *
   */
  KOTreePosition.prototype.getFollowingPosition = function() {
    var nextID = KOTournamentModel.nextRoundMatchID(this.id);

    return new KOTreePosition(nextID, this.group, this.numTeams);
  };

  KOTreePosition.WIDTH = width;
  KOTreePosition.HEIGHT = height;
  KOTreePosition.TOPPADDING = topPadding;
  KOTreePosition.LEFTPADDING = leftPadding;

  return KOTreePosition;
});
