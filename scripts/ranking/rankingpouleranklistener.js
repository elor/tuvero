define(
  ["lib/extend", "ranking/rankingdatalistener", "math/vectormodel"],
  function (extend, RankingDataListener, VectorModel) {
    function RankingPouleRankListener(ranking) {
      RankingPouleRankListener.superconstructor.call(this, ranking, new VectorModel());
    }
    extend(RankingPouleRankListener, RankingDataListener);

    RankingPouleRankListener.NAME = "poulerank";
    RankingPouleRankListener.DEPENDENCIES = undefined;

    RankingPouleRankListener.prototype.onresult = function (r, e, result) {
      var ranks;

      ranks = this.ranking.tournament.getRanksFromTable(result.getID(), result.getGroup());
      if (ranks) {
        this.poulerank.set(result.getWinner(), ranks.winner);
        this.poulerank.set(result.getLoser(), ranks.loser);
      }
    };

    RankingPouleRankListener.prototype.oncorrect = function (r, e, correction) {
      this.onresult(r, e, correction.after);
    };

    return RankingPouleRankListener;
  });