/**
 * RankingModel class tests
 *
 * @return test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(function () {
  return function (QUnit, getModule) {
    var RankingModel, Model, extend, MatchResult, MatchModel, Listener, Options, CorrectionModel;

    RankingModel = getModule("ranking/rankingmodel");
    MatchResult = getModule("core/matchresult");
    MatchModel = getModule("core/matchmodel");
    Listener = getModule("core/listener");
    Model = getModule("core/model");
    Options = getModule("options");
    extend = getModule("lib/extend");
    CorrectionModel = getModule("core/correctionmodel");

    QUnit.test("RankingModel", function (assert) {
      var ranking, rankingobject, ref, listener, savedata, ret;

      assert.equal(Options.byepointswon, 13,
          "Options.byepointswon is set properly");
      assert.equal(Options.byepointslost, 7,
          "Options.byepointslost is set properly");

      listener = new Listener();
      listener.reset = function () {
        this.updated = 0;
        this.numreset = 0;
        this.resized = 0;
      };
      listener.onupdate = function () {
        this.updated += 1;
      };
      listener.onreset = function () {
        this.numreset += 1;
      };
      listener.onresize = function () {
        this.resized += 1;
      };

      assert.ok(extend.isSubclass(RankingModel, Model),
          "RankingModel is a subclass of Model and, hence, Emitter");

      ranking = new RankingModel();
      assert.ok(ranking, "empty initialization produces a valid ranking");
      ref = {
        components: [],
        ids: [],
        displayOrder: [],
        ranks: []
      };
      assert.deepEqual(ranking.get(), ref,
          "empty initialization produces a valid ranking");

      ranking = new RankingModel([], 5);
      assert.ok(ranking, "empty components produce empty ranking");
      assert.equal(ranking.length, 0, "empty ranking has no length");

      ranking = new RankingModel([], 5, ["wins", "points"]);
      assert.deepEqual(ranking.extDeps, ["wins", "points"],
          "empty ranking does not ignore extra dependencies");
      assert.ok(ranking.points, "extradeps: wins are created and listening");
      assert.ok(ranking.wins, "extradeps: points are created and listening");

      ranking = new RankingModel(["points"], 5);
      assert.ok(ranking, "valid initialization");
      assert.equal(ranking.length, 5, "valid ranking size");

      ranking = new RankingModel(["points"]);
      assert.ok(ranking, "sizeless ranking can be created");
      assert.equal(ranking.length, 0, "ranking size defaults to 0");

      ranking = new RankingModel(["numgames", "wins", "saldo", "points"], 5);
      assert.equal(ranking.dataListeners.numgames.isPrimary(), true,
          "numgames is primary");
      assert.equal(ranking.dataListeners.wins.isPrimary(), true,
          "wins is primary");
      assert.equal(ranking.dataListeners.saldo.isPrimary(), false,
          "saldo is secondary");
      assert.equal(ranking.dataListeners.points.isPrimary(), true,
          "points is primary");
      assert.equal(ranking.dataListeners.lostpoints.isPrimary(), true,
          "lostpoints is primary");

      ranking = new RankingModel(["numgames", "wins"], 5, ["saldo"]);
      assert.equal(ranking.dataListeners.saldo.isPrimary(), false,
          "extraDependency: saldo is secondary");
      assert.equal(ranking.dataListeners.points.isPrimary(), true,
          "extraDependency: points is primary");
      assert.equal(ranking.dataListeners.lostpoints.isPrimary(), true,
          "extraDependency: lostpoints is primary");

      ranking = new RankingModel(["numgames", "wins", "saldo", "points"], 5);
      listener.reset();
      ranking.registerListener(listener);

      ref = {
        components: ["numgames", "wins", "saldo", "points"],
        ids: [0, 1, 2, 3, 4],
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3, 4],
        numgames: [0, 0, 0, 0, 0],
        wins: [0, 0, 0, 0, 0],
        saldo: [0, 0, 0, 0, 0],
        points: [0, 0, 0, 0, 0]
      };
      rankingobject = ranking.get();
      assert.ok(rankingobject, "ranking.get works");
      assert.deepEqual(rankingobject, ref, "empty ranking is not empty");

      ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [13, 7]));
      ref = {
        components: ["numgames", "wins", "saldo", "points"],
        ids: [0, 1, 2, 3, 4],
        ranks: [2, 0, 2, 1, 2],
        displayOrder: [1, 3, 0, 2, 4],
        numgames: [0, 1, 0, 1, 0],
        wins: [0, 1, 0, 0, 0],
        saldo: [0, 6, 0, -6, 0],
        points: [0, 13, 0, 7, 0]
      };

      rankingobject = ranking.get();
      assert.ok(rankingobject, "ranking.get works");
      assert.deepEqual(rankingobject, ref, "ranking is correct");
      assert.equal(listener.updated, 1, "result(): update event fired");

      ref = rankingobject;

      listener.reset();
      ranking.invalidate();
      rankingobject = ranking.get();
      assert.ok(rankingobject !== ref, "invalidate() triggers a recalculation");
      assert.equal(listener.updated, 1, "invalidate(): update event fired");

      listener.reset();
      ranking.result(new MatchResult(new MatchModel([0, 4], 0, 0), [0, 11]));
      rankingobject = ranking.get();

      ref = {
        components: ["numgames", "wins", "saldo", "points"],
        ids: [0, 1, 2, 3, 4],
        ranks: [3, 1, 4, 2, 0],
        displayOrder: [4, 1, 3, 0, 2],
        numgames: [1, 1, 0, 1, 1],
        wins: [0, 1, 0, 0, 1],
        saldo: [-11, 6, 0, -6, 11],
        points: [0, 13, 0, 7, 11]
      };
      assert.deepEqual(rankingobject, ref, "second ranking is correct");
      assert.equal(listener.updated, 1, "result(): update event fired");

      ref = {
        components: ["wins", "buchholz", "finebuchholz", "points"],
        ids: [0, 1, 2, 3, 4],
        displayOrder: [2, 4, 3, 0, 1],
        ranks: [3, 4, 0, 2, 1],
        wins: [0, 0, 2, 1, 1],
        buchholz: [2, 2, 1, 0, 2],
        finebuchholz: [2, 1, 4, 2, 3],
        points: [3, 5, 26, 13, 24]
      };

      ranking = new RankingModel(
          ["wins", "buchholz", "finebuchholz", "points"], 5);

      assert.equal(ranking.dataListeners.buchholz.isPrimary(), false,
          "buchholz is secondary");
      assert.equal(ranking.dataListeners.finebuchholz.isPrimary(), false,
          "finebuchholz is secondary");
      assert.equal(ranking.dataListeners.gamematrix.isPrimary(), false,
          "gamematrix is secondary");
      assert.equal(ranking.dataListeners.points.isPrimary(), true,
          "points is primary");
      assert.equal(ranking.dataListeners.wins.isPrimary(), true,
          "wins is primary");
      assert.equal(ranking.dataListeners.winsmatrix.isPrimary(), true,
          "winsmatrix is primary");

      ranking.result(new MatchResult(new MatchModel([0, 4], 0, 0), [3, 13]));
      ranking.result(new MatchResult(new MatchModel([1, 2], 0, 0), [5, 13]));
      ranking.result(new MatchResult(new MatchModel([3, 0], 0, 0), [13, 0]));
      ranking.result(new MatchResult(new MatchModel([4, 2], 0, 0), [11, 13]));

      rankingobject = ranking.get();

      assert.deepEqual(rankingobject, ref, "finebuchholz ranking is correct");

      ranking = new RankingModel(["numgames", "wins"], 5);
      ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [13, 0]));
      ranking.result(new MatchResult(new MatchModel([2, 4], 0, 0), [0, 13]));
      ref = {
        components: ["numgames", "wins"],
        ids: [0, 1, 2, 3, 4],
        ranks: [4, 0, 2, 2, 0],
        displayOrder: [1, 4, 2, 3, 0],
        numgames: [0, 1, 1, 1, 1],
        wins: [0, 1, 0, 0, 1]
      };
      rankingobject = ranking.get();
      assert.deepEqual(rankingobject, ref, "ranks order is correct");

      /*
       * bye()
       */
      ranking = new RankingModel(["numgames", "wins", "points", "lostpoints",
          "saldo", "buchholz", "finebuchholz"], 5);
      ranking.bye(2);
      ref = {
        components: ["numgames", "wins", "points", "lostpoints", "saldo",
            "buchholz", "finebuchholz"],
        ids: [0, 1, 2, 3, 4],
        ranks: [1, 1, 0, 1, 1],
        displayOrder: [2, 0, 1, 3, 4],
        numgames: [0, 0, 1, 0, 0],
        wins: [0, 0, 1, 0, 0],
        points: [0, 0, 13, 0, 0],
        lostpoints: [0, 0, -7, 0, 0],
        saldo: [0, 0, 6, 0, 0],
        buchholz: [0, 0, 0, 0, 0],
        finebuchholz: [0, 0, 0, 0, 0]
      };
      rankingobject = ranking.get();
      assert.deepEqual(rankingobject, ref,
          "bye() is applied properly to all basic components");

      ranking.bye([0, 1, 3]);
      ref = {
        components: ["numgames", "wins", "points", "lostpoints", "saldo",
            "buchholz", "finebuchholz"],
        ids: [0, 1, 2, 3, 4],
        ranks: [0, 0, 0, 0, 4],
        displayOrder: [0, 1, 2, 3, 4],
        numgames: [1, 1, 1, 1, 0],
        wins: [1, 1, 1, 1, 0],
        points: [13, 13, 13, 13, 0],
        lostpoints: [-7, -7, -7, -7, 0],
        saldo: [6, 6, 6, 6, 0],
        buchholz: [0, 0, 0, 0, 0],
        finebuchholz: [0, 0, 0, 0, 0]
      };
      rankingobject = ranking.get();
      assert.deepEqual(rankingobject, ref,
          "bye() with multiple teams works (all teams receive bye)");

      ranking.result(new MatchResult(new MatchModel([3, 1], 0, 0), [13, 7]));
      ref = {
        components: ["numgames", "wins", "points", "lostpoints", "saldo",
            "buchholz", "finebuchholz"],
        ids: [0, 1, 2, 3, 4],
        ranks: [2, 1, 2, 0, 4],
        displayOrder: [3, 1, 0, 2, 4],
        numgames: [1, 2, 1, 2, 0],
        wins: [1, 1, 1, 2, 0],
        points: [13, 20, 13, 26, 0],
        lostpoints: [-7, -20, -7, -14, 0],
        saldo: [6, 0, 6, 12, 0],
        buchholz: [0, 2, 0, 1, 0],
        finebuchholz: [0, 1, 0, 2, 0]
      };
      rankingobject = ranking.get();
      assert.deepEqual(rankingobject, ref,
          "buchholz and finebuchholz include bye-induced wins");

      /*
       * resize()
       */
      ranking.resize(6);
      ref = {
        components: ["numgames", "wins", "points", "lostpoints", "saldo",
            "buchholz", "finebuchholz"],
        ids: [0, 1, 2, 3, 4, 5],
        ranks: [2, 1, 2, 0, 4, 4],
        displayOrder: [3, 1, 0, 2, 4, 5],
        numgames: [1, 2, 1, 2, 0, 0],
        wins: [1, 1, 1, 2, 0, 0],
        points: [13, 20, 13, 26, 0, 0],
        lostpoints: [-7, -20, -7, -14, 0, 0],
        saldo: [6, 0, 6, 12, 0, 0],
        buchholz: [0, 2, 0, 1, 0, 0],
        finebuchholz: [0, 1, 0, 2, 0, 0]
      };
      rankingobject = ranking.get();
      assert.deepEqual(rankingobject, ref,
          "resize() is able to append a team to the ranking");

      ranking.resize(3);
      ref = {
        components: ["numgames", "wins", "points", "lostpoints", "saldo",
            "buchholz", "finebuchholz"],
        ids: [0, 1, 2],
        ranks: [1, 0, 1],
        displayOrder: [1, 0, 2],
        numgames: [1, 2, 1],
        wins: [1, 1, 1],
        points: [13, 20, 13],
        lostpoints: [-7, -20, -7],
        saldo: [6, 0, 6],
        buchholz: [0, 0, 0],
        finebuchholz: [0, 0, 0]
      };
      rankingobject = ranking.get();
      assert.deepEqual(rankingobject, ref,
          "resize() shrinks without changing the actual values");

      /*
       * reset()
       */
      ranking.reset();
      ref = {
        components: [],
        ids: [],
        displayOrder: [],
        ranks: []
      };
      rankingobject = ranking.get();
      assert.deepEqual(rankingobject, ref,
          "reset() restores to an empty ranking");
      assert.deepEqual(ranking.length, 0, "reset() resizes to 0");

      ranking = new RankingModel(["wins", "saldo"], 5);
      ranking.bye(3);
      ranking.result(new MatchResult(new MatchModel([2, 0], 0, 0), [13, 8]));
      ranking.result(new MatchResult(new MatchModel([1, 4], 0, 0), [11, 9]));
      savedata = ranking.save();
      assert.ok(savedata, "save() works");

      /*
       * restore
       */
      ranking = new RankingModel();
      assert.equal(ranking.restore(savedata), true, "restore() succeeds");
      ret = ranking.get();
      ref = {
        components: ["wins", "saldo"],
        ids: [0, 1, 2, 3, 4],
        ranks: [4, 2, 1, 0, 3],
        displayOrder: [3, 2, 1, 4, 0],
        wins: [0, 1, 1, 1, 0],
        saldo: [-5, 2, 5, 6, -2]
      };
      assert.deepEqual(ret, ref, "restore restores the proper stuff");

      /**
       * correct
       */
      ranking.correct(new CorrectionModel(//
      new MatchResult(new MatchModel([2, 0], 0, 0), [13, 8]),//
      new MatchResult(new MatchModel([2, 0], 0, 0), [8, 13]))//
      );
      ref = {
        components: ["wins", "saldo"],
        ids: [0, 1, 2, 3, 4],
        ranks: [1, 2, 4, 0, 3],
        displayOrder: [3, 0, 1, 4, 2],
        wins: [1, 1, 0, 1, 0],
        saldo: [5, 2, -5, 6, -2]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, "restore restores the proper stuff");

      /**
       * restore with a id-only ranking
       */
      ranking = new RankingModel(["id"], 5);
      savedata = ranking.save();
      ranking = new RankingModel();
      ranking.restore(savedata);
      assert.equal(ranking.length, 5,
          "restore() of an id-only ranking also restores the length");

      ref = {
        components: ["id"],
        ids: [0, 1, 2, 3, 4],
        ranks: [0, 1, 2, 3, 4],
        displayOrder: [0, 1, 2, 3, 4],
        id: [0, 1, 2, 3, 4]
      };
      assert.deepEqual(ranking.get(), ref, "id ranking is in correct order");

    });
  };
});
