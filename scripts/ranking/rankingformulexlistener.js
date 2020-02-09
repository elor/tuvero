/**
 * RankingFormuleXListener
 *
 * @return RankingFormuleXListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingdatalistener', 'math/vectormodel', //
  'options'], function (extend, RankingDataListener, VectorModel, Options) {
  var byepointswon, byepointslost

  // FIXME extract to options/presets
  function winscore (round) {
    return (Math.floor(round / 4) + 1) * 100
  }
  byepointswon = 13
  byepointslost = 12

  function sign (num) {
    return (num > 0) - (num < 0)
  }

  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingFormuleXListener (ranking) {
    RankingFormuleXListener.superconstructor.call(this, ranking, new VectorModel())
  }
  extend(RankingFormuleXListener, RankingDataListener)

  RankingFormuleXListener.NAME = 'formulex'

  RankingFormuleXListener.prototype.onresult = function (r, e, result) {
    var winner, loser, difference, points

    if (result.teams.length !== 2) {
      throw new Error('FormuleX ranking requires exactly two teams per match')
    }

    difference = result.score[0] - result.score[1]
    switch (sign(difference)) {
      case -1:
        winner = 1
        loser = 0
        difference = -difference
        break
      case 1:
        winner = 0
        loser = 1
        break
      case 0:
        // Draw. Everyone gets their own score
        result.teams.forEach(function (team, index) {
          this.formulex.set(team, this.formulex.get(team) + result.score[index])
        })
        return
      default:
        console.error('FormuleX ranking does not accept draws')
        return
    }

    // winner
    points = this.formulex.get(result.teams[winner]) + result.score[winner] +
        winscore(result.group) + difference
    this.formulex.set(result.teams[winner], points)

    // loser
    points = this.formulex.get(result.teams[loser]) + result.score[loser]
    this.formulex.set(result.teams[loser], points)
  }

  /**
   * bye listener
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event, i.e. 'bye'
   * @param teams
   *          an array of teams, as prepared and provided by RankingModel.bye()
   */
  RankingFormuleXListener.prototype.onbye = function (r, e, data) {
    var teams, round
    teams = data.teams
    round = data.round
    teams.forEach(function (team) {
      var points = this.formulex.get(team) + winscore(round) + byepointswon + (byepointswon - byepointslost)
      this.formulex.set(team, points)
    }, this)
  }

  RankingFormuleXListener.prototype.oncorrect = function (r, e, correction) {
    throw Error('FormuleX oncorrect() not implemented yet!')
  }

  return RankingFormuleXListener
})
