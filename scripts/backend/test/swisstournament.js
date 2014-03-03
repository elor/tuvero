/*
 * Swisstournament Test
 */
define([ '../swisstournament', '../game', '../tournament',
    '../../lib/interface' ], function (Swisstournament, Game, Tournament, Interface) {
  QUnit.test("Swisstournament", function () {
    var st, corr, count, pid, valid, games1, games2, games3, rnk, res, tmp;

    QUnit.equal(Interface(Tournament), '', 'Tournament interface validation');
    QUnit.equal(Interface(Tournament, Swisstournament, 'rfm'), '', 'Swisstournament interface match');

    st = new Swisstournament();
    QUnit.equal(st.state, Swisstournament.state.preparing || 0, 'initial state is 0 (preparing)');

    QUnit.equal(st.start(), undefined, 'premature start is aborted');

    tmp = [ 'Antje', 'Basta', 'Christian', 'David', 'Erik', 'Fabe', 'Hartmut',
        'Inka', 'Karo', 'Mario', 'Peter', 'Stefan', 'Thomas' ];

    // only append 9 players
    tmp.forEach(function (p, playerid) {
      if (playerid >= tmp.length - 9) {
        st.addPlayer(playerid);
      }
    });

    QUnit.equal(st.players.size(), 9, 'player map size');

    QUnit.equal(st.getRound(), 0, 'round is 0 before starting');
    QUnit.equal(st.start(), st, 'start() retval');
    QUnit.equal(st.state, Swisstournament.state.running || 1, 'running state is 1 (running)');
    QUnit.equal(st.getRound(), 1, 'round  is 1 after starting (autostart)');

    games1 = st.openGames();

    QUnit.equal(games1.length, 4, 'first round: correct number of games');

    count = 0;
    pid = -1;
    st.byevote.forEach(function (bye, p) {
      if (bye === true) {
        count += 1;
        pid = p;
      }
    });

    QUnit.equal(count, 1, 'first round: one byevote');

    pid = st.players.at(pid);

    valid = true;
    games1.forEach(function (game) {
      if (game.teams[0][0] === pid || game.teams[1][0] === pid) {
        valid = false;
      }
    });

    QUnit.equal(valid, true, 'first round: byevote didn\'t play');

    count = 0;
    pid = -1;
    st.downvote.forEach(function (down, p) {
      if (down === true) {
        count += 1;
        pid = p;
      }
    });

    QUnit.equal(count, 0, 'first round: no downvotes');

    count = 0;
    pid = -1;
    st.upvote.forEach(function (up, p) {
      if (up === true) {
        count += 1;
        pid = p;
      }
    });

    QUnit.equal(count, 0, 'first round: no upvotes');

    st.finishGame(games1[0], [ 13, 8 ]);
    st.finishGame(games1[1], [ 5, 13 ]);
    st.finishGame(games1[2], [ 13, 4 ]);
    st.finishGame(games1[3], [ 13, 6 ]);

    QUnit.equal(st.openGames().length, 0, 'first round: all games finished');

    rnk = st.getRanking();

    QUnit.equal(rnk.wins.length, 9, 'ranking: correct length (wins)');
    QUnit.equal(rnk.ids.length, 9, 'ranking: correct length (ids)');

    res = rnk.wins[0] + rnk.wins[1] + rnk.wins[2] + rnk.wins[3] + rnk.wins[4];

    QUnit.equal(res, 5, 'ranking: five wins in right order');

    res = rnk.wins[5] + rnk.wins[6] + rnk.wins[7] + rnk.wins[8];

    QUnit.equal(res, 0, 'ranking: four losses in right order');

    // correct a game
    st.correct(games1[2], [ 13, 4 ], [ 4, 13 ]);
    corr = {
      game : games1[2].copy(),
      oldpoints : [ 13, 4 ],
      newpoints : [ 4, 13 ]
    };

    // recheck the results
    rnk = st.getRanking();

    QUnit.equal(rnk.wins.length, 9, 'ranking: correct length (wins)');
    QUnit.equal(rnk.ids.length, 9, 'ranking: correct length (ids)');

    res = rnk.wins[0] + rnk.wins[1] + rnk.wins[2] + rnk.wins[3] + rnk.wins[4];

    QUnit.equal(res, 5, 'ranking: five wins in right order');

    res = rnk.wins[5] + rnk.wins[6] + rnk.wins[7] + rnk.wins[8];

    QUnit.equal(res, 0, 'ranking: four losses in right order');

    // consider second round
    res = st.newRound();

    QUnit.equal(res, st, 'second round: generation successful');

    games2 = st.openGames();

    QUnit.equal(games2.length, 4, 'second round: 4 games');

    count = 0;

    st.downvote.forEach(function (down) {
      if (down) {
        count += 1;
      }
    }, this);

    QUnit.equal(count, 1, "second round: one downvote");

    count = 0;
    st.upvote.forEach(function (up) {
      if (up) {
        count += 1;
      }
    }, this);

    QUnit.equal(count, 1, "second round: one upvote");

    count = 0;
    st.byevote.forEach(function (bye) {
      if (bye) {
        count += 1;
      }
    }, this);

    QUnit.equal(count, 2, "second round: second byevote");

    tmp = [ st.players.at(st.downvote.indexOf(true)),
        st.players.at(st.upvote.indexOf(true)) ];

    tmp = [ new Game(tmp[0], tmp[1]), new Game(tmp[1], tmp[0]) ];

    count = 0;
    games2.forEach(function (game) {
      if (game.equals(tmp[0])) {
        count += 1;
      }
      if (game.equals(tmp[1])) {
        count += 1;
      }
    }, this);

    QUnit.equal(count, 1, 'second round: downvote vs. upvote');

    tmp = [];
    games1.forEach(function (game) {
      tmp.push(new Game(game.teams[1][0], game.teams[0][0]));
    }, this);

    count = 0;

    games2.forEach(function (g2) {
      games1.forEach(function (g1) {
        if (g2.equals(g1)) {
          count += 1;
        }
      }, this);

      tmp.forEach(function (g1) {
        if (g2.equals(g1)) {
          count += 1;
        }
      }, this);
    }, this);

    QUnit.equal(count, 0, 'second round: non-repetitive fixtures');

    res = st.finishGame(new Game(0, 0), [ 13, 7 ]);

    QUnit.equal(res, undefined, 'second round: invalid game');

    res = st.finishGame(games2[3], [ 13, 0 ]);
    QUnit.equal(res, st, 'second round: valid game');

    res = st.finishGame(games2[3], [ 10, 13 ]);
    QUnit.equal(res, undefined, 'second round: declining resubmitted result');

    st.finishGame(games2[1], [ 11, 13 ]);
    st.finishGame(games2[2], [ 13, 8 ]);
    // the upvote wins this game to secure a third round
    st.finishGame(games2[0], [ 5, 13 ]);

    res = st.openGames();
    QUnit.equal(res.length, 0, 'second round: all games closed');

    // consider third round. Shuffling can fail with too few players as in this
    // test, so shuffle multiple times and it should work in 99.999% of cases
    for (tmp = 0; tmp < 10; tmp += 1) {
      res = st.newRound();
      if (res !== undefined) {
        break;
      }
    }
    games3 = st.openGames();
    QUnit.equal(res, st, 'third round: valid randomization');
    QUnit.equal(games3.length, 4, 'third round: four games');

    count = 0;
    st.byevote.forEach(function (bye) {
      if (bye) {
        count += 1;
      }
    }, this);

    QUnit.equal(count, 3, "third round: third byevote");

    st.finishGame(games3[3], [ 5, 13 ]);
    st.finishGame(games3[2], [ 2, 13 ]);
    st.finishGame(games3[1], [ 13, 9 ]);
    st.finishGame(games3[0], [ 13, 12 ]);

    count = st.openGames().length;

    QUnit.equal(count, 0, 'third round: finished');

    QUnit.deepEqual(st.getCorrections(), [ corr ], 'getCorrections()');

    // // check tournament deadlock with too few players
    // st = new Swisstournament();
    // tmp = [ 'Antje', 'Basta', 'Christian', 'David', 'Erik', 'Fabe',
    // 'Hartmut',
    // 'Inka', 'Karo', 'Mario', 'Peter', 'Stefan', 'Thomas' ];
    //
    // // only append 9 players
    // tmp.forEach(function (p, pid) {
    // if (pid >= tmp.length - 9) {
    // st.addPlayer(pid);
    // }
    // });
    //
    // st.start();
    // games1 = st.openGames();
    // st.finishGame(games1[0], [ 13, 8 ]);
    // st.finishGame(games1[1], [ 5, 13 ]);
    // st.finishGame(games1[2], [ 4, 13 ]);
    // st.finishGame(games1[3], [ 13, 6 ]);
    // st.newRound();
    // games2 = st.openGames();
    // st.finishGame(games2[3], [ 13, 0 ]);
    // st.finishGame(games2[1], [ 11, 13 ]);
    // st.finishGame(games2[2], [ 13, 8 ]);
    // // this time, the downvote wins to inhibit a third round
    // st.finishGame(games2[0], [ 13, 5 ]);
    //
    // // third round is impossible
    // for (tmp = 0; tmp < 100; tmp += 1) {
    // res = st.newRound();
    // if (res !== undefined) {
    // break;
    // }
    // }
    // QUnit.equal(res, undefined, 'tournament deadlock verified');
  });
});
