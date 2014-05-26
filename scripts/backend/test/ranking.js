/**
 * various ranking tests
 */

define([ '../result', '../nettoranking', '../buchholzranking',
    '../finebuchholzranking', '../game', '../correction',
    '../../lib/implements', '../ranking' ], function (Result, Netto, Buchholz, Finebuchholz, Game, Correction, Interface, Ranking) {
  /*
   * NettoRanking test
   */
  QUnit.test("NettoRanking", function () {
    var resa, resb, ranking, tmp, corr;

    QUnit.equal(Interface(Ranking), '', 'Ranking interface validation');
    QUnit.equal(Interface(Ranking, Netto, 'rfm'), '', 'NettoRanking interface match');

    ranking = new Netto(5);
    QUnit.equal(ranking.size(), 5, "size test");

    resa = new Result(1, 3, 5, 13);
    resb = new Result([ 0, 1 ], [ 2, 4 ], 11, 0);
    ranking.add(resa).add(resb);

    tmp = {
      byes : [ 0, 0, 0, 0, 0 ],
      netto : [ 11, 3, -11, 8, -11 ],
      ranking : [ 0, 3, 1, 2, 4 ],
      size : 5,
      wins : [ 1, 1, 0, 1, 0 ]
    };
    QUnit.deepEqual(ranking.get(), tmp, "get() after add()");

    QUnit.ok(ranking.added(new Game(3, 1)), 'valid added()');
    QUnit.ok(!ranking.added(new Game(2, 4)), 'invalid added()');

    ranking.remove(resa);
    tmp = {
      byes : [ 0, 0, 0, 0, 0 ],
      netto : [ 11, 11, -11, 0, -11 ],
      size : 5,
      ranking : [ 0, 1, 3, 2, 4 ],
      wins : [ 1, 1, 0, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after remove()");

    resb = new Result(2, 3, 13, 5);
    ranking.add(resa);
    corr = new Correction(resa, resb);
    tmp = ranking.correct(corr);

    QUnit.equal(tmp, ranking, 'correct() was successful');

    tmp = {
      byes : [ 0, 0, 0, 0, 0 ],
      netto : [ 11, 11, -3, -8, -11 ],
      ranking : [ 0, 1, 2, 3, 4 ],
      size : 5,
      wins : [ 1, 1, 1, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after correct()");

    ranking.resize(2);
    ranking.resize(5);

    tmp = {
      byes : [ 0, 0, 0, 0, 0 ],
      netto : [ 11, 11, 0, 0, 0 ],
      ranking : [ 0, 1, 2, 3, 4 ],
      size : 5,
      wins : [ 1, 1, 0, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after resize()");

    ranking.grantBye(3);

    tmp = {
      byes : [ 0, 0, 0, 1, 0 ],
      netto : [ 11, 11, 0, 6, 0 ],
      ranking : [ 0, 1, 3, 2, 4 ],
      size : 5,
      wins : [ 1, 1, 0, 1, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after grantBye()");

    ranking.revokeBye(1);

    QUnit.deepEqual(ranking.get(), tmp, "get() after invalid revokeBye()");

    ranking.revokeBye(3);

    tmp = {
      byes : [ 0, 0, 0, 0, 0 ],
      netto : [ 11, 11, 0, 0, 0 ],
      ranking : [ 0, 1, 2, 3, 4 ],
      size : 5,
      wins : [ 1, 1, 0, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after revokeBye()");

    QUnit.deepEqual(ranking.getCorrections(), [ corr ], 'getCorrections()');
  });

  /*
   * BuchholzRanking test
   */
  QUnit.test("BuchholzRanking", function () {
    var resa, resb, resc, ranking, tmp, corr;

    QUnit.equal(Interface(Ranking), '', 'Ranking interface validation');
    QUnit.equal(Interface(Ranking, Buchholz, 'rfm'), '', 'BuchholzRanking interface match');

    ranking = new Buchholz(5);
    QUnit.equal(ranking.size(), 5, "size test");

    resa = new Result(1, 2, 0, 13);
    resb = new Result(2, 3, 13, 3);
    resc = new Result(1, 4, 13, 10);
    ranking.add(resa).add(resb).add(resc);

    tmp = {
      buchholz : [ 0, 2, 1, 2, 1 ],
      byes : [ 0, 0, 0, 0, 0 ],
      netto : [ 0, -10, 23, -10, -3 ],
      ranking : [ 2, 1, 3, 4, 0 ],
      size : 5,
      wins : [ 0, 1, 2, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after add()");

    QUnit.ok(ranking.added(new Game(3, 2)), 'valid added()');
    QUnit.ok(!ranking.added(new Game(2, 4)), 'invalid added()');

    ranking.remove(resb);

    tmp = {
      buchholz : [ 0, 1, 1, 0, 1 ],
      byes : [ 0, 0, 0, 0, 0 ],
      netto : [ 0, -10, 13, 0, -3 ],
      ranking : [ 2, 1, 4, 0, 3 ],
      size : 5,
      wins : [ 0, 1, 1, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after remove()");

    resb = new Result(2, 0, 5, 13);
    ranking.add(resb);
    tmp = new Result(2, 0, 13, 5);
    corr = new Correction(resb, tmp);
    tmp = ranking.correct(corr);

    QUnit.equal(tmp, ranking, 'correct() was successful');

    tmp = {
      buchholz : [ 2, 2, 1, 0, 1 ],
      byes : [ 0, 0, 0, 0, 0 ],
      netto : [ -8, -10, 21, 0, -3 ],
      ranking : [ 2, 1, 0, 4, 3 ],
      size : 5,
      wins : [ 0, 1, 2, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after correct()");

    ranking.resize(3);
    ranking.resize(5);

    tmp = {
      buchholz : [ 2, 2, 1, 0, 0 ],
      byes : [ 0, 0, 0, 0, 0 ],
      netto : [ -8, -10, 21, 0, 0 ],
      ranking : [ 2, 1, 0, 3, 4 ],
      size : 5,
      wins : [ 0, 1, 2, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after resize()");

    ranking.grantBye(1);

    tmp = {
      buchholz : [ 2, 2, 2, 0, 0 ],
      byes : [ 0, 1, 0, 0, 0 ],
      netto : [ -8, -4, 21, 0, 0 ],
      ranking : [ 2, 1, 0, 3, 4 ],
      size : 5,
      wins : [ 0, 2, 2, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after grantBye()");

    ranking.revokeBye(0);

    QUnit.deepEqual(ranking.get(), tmp, "get() after invalid revokeBye()");

    ranking.revokeBye(1);

    tmp = {
      buchholz : [ 2, 2, 1, 0, 0 ],
      byes : [ 0, 0, 0, 0, 0 ],
      netto : [ -8, -10, 21, 0, 0 ],
      ranking : [ 2, 1, 0, 3, 4 ],
      size : 5,
      wins : [ 0, 1, 2, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after revokeBye()");

    QUnit.deepEqual(ranking.getCorrections(), [ corr ], 'getCorrections()');
  });

  /*
   * Finebuchholz test
   */
  QUnit.test("Finebuchholz", function () {
    var resa, resb, resc, ranking, tmp, corr;

    QUnit.equal(Interface(Ranking), '', 'Ranking interface validation');
    QUnit.equal(Interface(Ranking, Finebuchholz, 'rfm'), '', 'FinebuchholzRanking interface match');

    ranking = new Finebuchholz(5);
    QUnit.equal(ranking.size(), 5, "size test");

    resa = new Result(1, 2, 0, 13);
    resb = new Result(2, 3, 13, 3);
    resc = new Result(1, 4, 13, 10);
    ranking.add(resa).add(resb).add(resc);

    tmp = {
      byes : [ 0, 0, 0, 0, 0 ],
      buchholz : [ 0, 2, 1, 2, 1 ],
      finebuchholz : [ 0, 2, 4, 1, 2 ],
      games : [ 0, 2, 2, 1, 1 ],
      netto : [ 0, -10, 23, -10, -3 ],
      ranking : [ 2, 1, 3, 4, 0 ],
      size : 5,
      wins : [ 0, 1, 2, 0, 0 ]
    };

    QUnit.ok(ranking.added(new Game(3, 2)), 'valid added()');
    QUnit.ok(!ranking.added(new Game(2, 4)), 'invalid added()');

    QUnit.deepEqual(ranking.get(), tmp, "get() after add()");

    ranking.remove(resb);

    tmp = {
      byes : [ 0, 0, 0, 0, 0 ],
      buchholz : [ 0, 1, 1, 0, 1 ],
      finebuchholz : [ 0, 2, 1, 0, 1 ],
      games : [ 0, 2, 1, 0, 1 ],
      netto : [ 0, -10, 13, 0, -3 ],
      ranking : [ 1, 2, 4, 0, 3 ],
      size : 5,
      wins : [ 0, 1, 1, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after remove()");

    resb = new Result(2, 0, 5, 13);
    ranking.add(resb);
    tmp = new Result(2, 0, 13, 5);
    corr = new Correction(resb, tmp);
    tmp = ranking.correct(corr);

    QUnit.equal(tmp, ranking, 'correct() successful');

    tmp = {
      byes : [ 0, 0, 0, 0, 0 ],
      buchholz : [ 2, 2, 1, 0, 1 ],
      finebuchholz : [ 1, 2, 4, 0, 2 ],
      games : [ 1, 2, 2, 0, 1 ],
      netto : [ -8, -10, 21, 0, -3 ],
      ranking : [ 2, 1, 0, 4, 3 ],
      size : 5,
      wins : [ 0, 1, 2, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after correct()");

    ranking.resize(3);
    ranking.resize(5);

    tmp = {
      byes : [ 0, 0, 0, 0, 0 ],
      buchholz : [ 2, 2, 1, 0, 0 ],
      finebuchholz : [ 1, 1, 4, 0, 0 ],
      games : [ 1, 1, 2, 0, 0 ],
      netto : [ -8, -10, 21, 0, 0 ],
      ranking : [ 2, 1, 0, 3, 4 ],
      size : 5,
      wins : [ 0, 1, 2, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after resize()");

    ranking.grantBye(0);

    tmp = {
      byes : [ 1, 0, 0, 0, 0 ],
      buchholz : [ 2, 2, 2, 0, 0 ],
      finebuchholz : [ 2, 2, 4, 0, 0 ],
      games : [ 2, 1, 2, 0, 0 ],
      netto : [ -2, -10, 21, 0, 0 ],
      ranking : [ 2, 0, 1, 3, 4 ],
      size : 5,
      wins : [ 1, 1, 2, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after grantBye()");

    ranking.revokeBye(1);
    QUnit.deepEqual(ranking.get(), tmp, "get() after invalid revokeBye()");

    ranking.revokeBye(0);

    tmp = {
      byes : [ 0, 0, 0, 0, 0 ],
      buchholz : [ 2, 2, 1, 0, 0 ],
      finebuchholz : [ 1, 1, 4, 0, 0 ],
      games : [ 1, 1, 2, 0, 0 ],
      netto : [ -8, -10, 21, 0, 0 ],
      ranking : [ 2, 1, 0, 3, 4 ],
      size : 5,
      wins : [ 0, 1, 2, 0, 0 ]
    };

    QUnit.deepEqual(ranking.get(), tmp, "get() after revokeBye()");

    QUnit.deepEqual(ranking.getCorrections(), [ corr ], 'getCorrections()');
  });
});
