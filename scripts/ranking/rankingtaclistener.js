import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';
import Options from 'options';
let winscore;

// FIXME extract "12" to the config.in
winscore = 12;
function sign(num) {
  if (num < 0) {
    return -1;
  }
  if (num > 0) {
    return 1;
  }
  if (num === 0) {
    return 0;
  }
  return NaN;
}

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingTacListener extends RankingDataListener {
  constructor(ranking) {
    super(ranking, new VectorModel());
  }

  onresult(r, e, result) {
    let winner, loser, difference, points;
    if (result.teams.length !== 2) {
      throw new Error('TAC ranking requires exactly two teams in a result');
    }
    difference = result.score[0] - result.score[1];
    switch (sign(difference)) {
      case -1:
        winner = 1;
        loser = 0;
        difference = -difference;
        break;
      case 1:
        winner = 0;
        loser = 1;
        break;
      case 0:
        winner = 0;
        loser = 0;
        break;
      default:
        console.error('TAC ranking does not accept draws');
        return undefined;
    }
    if (result.score[winner] >= Options.maxpoints && winner !== loser) {
      // everything went to completion

      // winner
      points = this.tac.get(result.teams[winner]) + winscore + difference;
      this.tac.set(result.teams[winner], points);

      // loser
      points = this.tac.get(result.teams[loser]) + result.score[loser];
      if (result.score[loser] === 0) {
        points += 1;
      }
      this.tac.set(result.teams[loser], points);
    } else {
      // game had to be aborted. Timeout situation: teams keep their own
      // points

      points = this.tac.get(result.teams[0]) + result.score[0];
      this.tac.set(result.teams[0], points);
      points = this.tac.get(result.teams[1]) + result.score[1];
      this.tac.set(result.teams[1], points);
    }
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
    data.teams.forEach(function (team) {
      const points = this.tac.get(team) + Options.byepointswon - Options.byepointslost + 12;
      this.tac.set(team, points);
    }, this);
  }

  oncorrect(r, e, correction) {
    // TODO DRY - Don't Repeat Yourself!
    // TODO extract a method for use by onresult and oncorrect
    let winner, loser, difference, points;
    if (correction.before.teams.length !== 2) {
      throw new Error('TAC ranking requires exactly two teams in a result');
    }
    difference = correction.before.score[0] - correction.before.score[1];
    switch (sign(difference)) {
      case -1:
        winner = 1;
        loser = 0;
        difference = -difference;
        break;
      case 1:
        winner = 0;
        loser = 1;
        break;
      case 0:
        winner = 0;
        loser = 0;
        break;
      default:
        console.error('TAC ranking does not accept draws');
        return undefined;
    }
    if (correction.before.score[winner] >= Options.maxpoints && winner !== loser) {
      // everything went to completion

      // winner
      points = this.tac.get(correction.before.teams[winner]) - winscore - difference;
      this.tac.set(correction.before.teams[winner], points);

      // loser
      points = this.tac.get(correction.before.teams[loser]) - correction.before.score[loser];
      if (correction.before.score[loser] === 0) {
        points -= 1;
      }
      this.tac.set(correction.before.teams[loser], points);
    } else {
      // game had to be aborted. Timeout situation: teams keep their own
      // points

      points = this.tac.get(correction.before.teams[0]) - correction.before.score[0];
      this.tac.set(correction.before.teams[0], points);
      points = this.tac.get(correction.before.teams[1]) - correction.before.score[1];
      this.tac.set(correction.before.teams[1], points);
    }
    this.onresult(r, e, correction.after);
  }

  static NAME = 'tac';
}

export default RankingTacListener;