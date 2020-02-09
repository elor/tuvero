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
  function winscore (round) {
    return (Math.floor(round / 4) + 1) * Options['formulexpoints']
  }

  function formulePoints (score, round) {
    var winner, points, difference

    if (score.length !== 2) {
      throw new Error('FormuleX ranking requires exactly two teams per match')
    }

    points = score.slice()
    difference = Math.abs(score[0] - score[1])

    if (difference) {
      winner = Number(score[1] > score[0])
      points[winner] += winscore(round) + difference
    }

    return points
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
    var points = formulePoints(result.score, result.group)

    points.forEach(function (p, index) {
      var team = result.teams[index]
      this.formulex.add(team, p)
    }, this)
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
    var points = formulePoints(Options['formulexbyescore'], data.round)[0]

    data.teams.forEach(function (team) {
      this.formulex.add(team, points)
    }, this)
  }

  RankingFormuleXListener.prototype.oncorrect = function (r, e, correction) {
    var pointsBefore = formulePoints(correction.before.score, correction.before.group)

    pointsBefore.forEach(function (points, index) {
      var team = correction.before.teams[index]
      this.formulex.add(team, -points)
    }, this)

    this.onresult(r, e, correction.after)
  }

  return RankingFormuleXListener
})
