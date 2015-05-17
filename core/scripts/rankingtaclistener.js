/**
 * RankingTacListener
 *
 * @return RankingTacListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(
    ['lib/extend', './rankingdatalistener', './vectormodel', 'options'],
    function(extend, RankingDataListener, VectorModel, Options) {

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
      function RankingTacListener(ranking) {
        RankingTacListener.superconstructor.call(this, ranking,
            new VectorModel());
      }
      extend(RankingTacListener, RankingDataListener);

      RankingTacListener.NAME = 'tac';

      RankingTacListener.prototype.onresult = function(r, e, result) {
        var winscore, winner, loser, diff, points;

        // FIXME extract "12" to the config.
        winscore = 12;

        if (result.teams.length !== 2) {
          throw new Error('TAC ranking requires exactly two teams in a result');
        }

        diff = result.score[0] - result.score[1];
        switch (sign(diff)) {
        case -1:
          winner = 1;
          loser = 0;
          diff = -diff;
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

        // FIXME extract "8" to the config
        if (result.score[winner] >= Options.maxpoints && winner !== loser) {
          // everything went to completion

          // winner
          points = this.tac.get(result.teams[winner]) + winscore + diff;
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
      };

      /**
       * bye listener
       *
       * @param r
       *          the Emitter, i.e. a RankingModel instance
       * @param e
       *          the event, i.e. 'bye'
       * @param teams
       *          an array of teams, as prepared and provided by
       *          RankingModel.bye()
       */
      RankingTacListener.prototype.onbye = function(r, e, teams) {
        teams.forEach(function(team) {
          var points = this.tac.get(team) + Options.byepointswon
              - Options.byepointslost;
          this.tac.set(team, points);
        }, this);
      };

      return RankingTacListener;
    });
