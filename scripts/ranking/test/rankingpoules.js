define(function () {
  return function (QUnit, getModule) {
    var RankingModel, MatchResult, MatchModel;

    RankingModel = getModule("ranking/rankingmodel");
    MatchResult = getModule("core/matchresult");
    MatchModel = getModule("core/matchmodel");

    QUnit.test("Poules Ranking", function (assert) {
      var ranking, ret, ref;

      ranking = new RankingModel(["pouleid", "wins", "saldo", "points"], 5);
      ref = {
        components: ["pouleid", "wins", "saldo", "points"],
        ids: [0, 1, 2, 3, 4],
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3, 4],
        pouleid: [1, 1, 1, 1, 1]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, "empty ranking: correct H2H-score");
    });
  };
});