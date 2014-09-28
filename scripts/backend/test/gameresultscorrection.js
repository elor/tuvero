/*
 * Game, Results and Correction
 */
define(function () {
  return function (QUnit, require) {
    var Game, Result, Correction;

    Game = require('backend/game');
    Result = require('backend/result');
    Correction = require('backend/correction');
    /*
     * Game Tests
     */
    QUnit.test('Game', function () {
      var game, res;
      game = new Game();

      QUnit.equal(game.teams.length, 0, 'no teams after construction');
      QUnit.equal(game.starttime, 0, 'no starttime');

      game.add(0, 1);
      game.add(1, 2);
      game.add(1, 5);

      QUnit.equal(game.teams.length, 2, 'two teams after three add() calls');
      QUnit.deepEqual([ game.teams[0], game.teams[1] ], [ [ 1 ], [ 2, 5 ] ], 'teams verified');

      game.start();
      QUnit.ok(game.starttime !== 0, 'start() seems to work');

      QUnit.ok(game !== game.copy(), 'copy() does in fact copy');
      res = game.copy();
      QUnit.deepEqual(res, game, "copy() works");

      res.starttime = 0;
      QUnit.ok(game.equals(res), 'equals works if equal');
      res.add(0, 3);
      QUnit.ok(!game.equals(res), 'equals works if different');
    });

    /*
     * Result Tests
     */
    QUnit.test("Result", function () {
      var a, b, c, pa, pb, res;

      a = 1;
      b = [ 2, 3 ];
      c = [ 2, 3 ];

      pa = 5;
      pb = 13;

      res = new Result(a, b, pa, pb);

      // team tests
      QUnit.equal(res.getTeam(), undefined, "undefined team request");
      QUnit.equal(res.getTeam(0), undefined, "0 team request");
      QUnit.equal(res.getTeam(b), undefined, "array team request");
      QUnit.deepEqual(res.getTeam(2), b, "team constructed by array");
      b[1] = 5;
      QUnit.deepEqual(res.getTeam(2), c, "team copied in constructor");
      QUnit.deepEqual(res.getTeam(1), [ a ], "team constructed by integer");

      // points tests
      QUnit.equal(res.getPoints(), undefined, "undefined points request");
      QUnit.equal(res.getPoints(0), undefined, "0 points request");

      QUnit.equal(res.getPoints(1), pa, "points of first team");
      QUnit.equal(res.getPoints(1), pa, "points of second team");

      QUnit.equal(res.getNetto(), pa - pb, "netto points");

      QUnit.deepEqual(res.copy(), res, 'copy()');
      QUnit.ok(res.copy() !== res, "copy() doesn't return this");

      b = new Game();

      b.add(0, a);
      c.forEach(function (i) {
        b.add(1, i);
      });

      QUnit.deepEqual(res.getGame(), b, 'result getGame()');
    });

    /*
     * Correction Tests
     */
    QUnit.test("Correction", function () {
      var res1, res2, corr;
      res1 = new Result(1, 2, 3, 4);
      res2 = new Result(4, 3, 2, 1);
      corr = new Correction(res1, res2);

      QUnit.deepEqual(corr.pre, res1, 'pre field');
      QUnit.deepEqual(corr.post, res2, 'post field');

      QUnit.deepEqual(corr.copy(), corr, 'copy copies');
      QUnit.ok(corr.copy() !== corr, "copy doesn't just reference");
    });
  };
});
