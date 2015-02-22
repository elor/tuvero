/**
 * RankingWinsListener
 *
 * @return RankingWinsListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingdatalistener', './vectormodel'],
    function(extend, RankingDataListener, VectorModel) {
      /**
       * Constructor
       *
       * @param ranking
       *          a RankingModel instance
       */
      function RankingWinsListener(ranking) {
        RankingWinsListener.superconstructor.call(this, ranking,
            new VectorModel());
      }
      extend(RankingWinsListener, RankingWinsListener);

      RankingWinsListener.NAME = 'wins';
      RankingWinsListener.DEPENDENCIES = undefined;

      /**
       * insert the results of a game into the ranking.
       *
       * @param r
       *          the emitting RankingModel instance. Please ignore.
       * @param e
       *          the name of the emitted event
       * @param result
       *          a game result
       */
      RankingWinsListener.prototype.oninsert = function(r, e, result) {
        var winner, maxpoints;

        winner = undefined;
        maxpoints = undefined;

        result.player.forEach(function(player, index) {
          var points;
          points = result.points[player];
          if (maxpoints === undefined || points > maxpoints) {
            winner = player;
            maxpoints = points;
          } else if (points === maxpoints) {
            winner = undefined;
          }
        }, this);

        if (winner !== undefined) {
          this.wins.set(winner, this.wins.get(winner) + 1);
        }
      };

      /**
       * correct a ranking entry. Do not check whether it's valid. The
       * TournamentModel has to take care of that
       *
       * @param correction
       *          a game correction
       */
      RankingWinsListener.prototype.oncorrect = function(r, e, correction) {
        console.error('RankingWinsListener.oncorrect() not implemented yet');
      };

      return RankingWinsListener;
    });
