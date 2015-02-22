/**
 * RankingGameMatrixListener
 *
 * @return RankingGameMatrixListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(
    ['lib/extend', './rankingdatalistener', './symmetricmatrixmodel'],
    function(extend, RankingDataListener, SymmetricMatrixModel) {
      /**
       * Constructor
       *
       * @param ranking
       *          a RankingModel instance
       */
      function RankingGameMatrixListener(ranking) {
        RankingGameMatrixListener.superconstructor.call(this, ranking,
            new SymmetricMatrixModel());
      }
      extend(RankingGameMatrixListener, RankingDataListener);

      RankingGameMatrixListener.NAME = 'gamematrix';

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
      RankingGameMatrixListener.prototype.onresult = function(r, e, result) {
        result.players.forEach(function(player) {
          result.players.forEach(function(opponent) {
            if (player > opponent) {
              // Note to self: this matrix is symmetric. Only change once!
              this.gamematrix.set(player, opponent, this.gamematrix.get(player,
                  opponent) + 1);
            }
          }, this);
        }, this);
      };

      /**
       * correct a ranking entry. Do not check whether it's valid. The
       * TournamentModel has to take care of that
       *
       * @param correction
       *          a game correction
       */
      RankingGameMatrixListener.prototype.oncorrect = function(r, e, correction) {
        console
            .error('RankingGameMatrixListener.oncorrect() not implemented yet');
      };

      return RankingGameMatrixListener;
    });
