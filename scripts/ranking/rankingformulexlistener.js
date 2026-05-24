import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';
import Options from 'options';
function winscore(round) {
  return (Math.floor(round / 4) + 1) * Options['formulexpoints'];
}
function formulePoints(score, round) {
  let winner, points, difference;
  if (score.length !== 2) {
    throw new Error('FormuleX ranking requires exactly two teams per match');
  }
  points = score.slice();
  difference = Math.abs(score[0] - score[1]);
  if (difference) {
    winner = Number(score[1] > score[0]);
    points[winner] += winscore(round) + difference;
  }
  return points;
}

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingFormuleXListener extends RankingDataListener {
  constructor(ranking) {
    super(ranking, new VectorModel());
  }

  onresult(r, e, result) {
    const points = formulePoints(result.score, result.group);
    points.forEach(function (p, index) {
      const team = result.teams[index];
      this.formulex.add(team, p);
    }, this);
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
  onbye(r, e, data) {
    const points = formulePoints(Options['formulexbyescore'], data.round)[0];
    data.teams.forEach(function (team) {
      this.formulex.add(team, points);
    }, this);
  }

  oncorrect(r, e, correction) {
    const pointsBefore = formulePoints(correction.before.score, correction.before.group);
    pointsBefore.forEach(function (points, index) {
      const team = correction.before.teams[index];
      this.formulex.add(team, -points);
    }, this);
    this.onresult(r, e, correction.after);
  }

  static NAME = 'formulex';
}

export default RankingFormuleXListener;