/*
 * KOTournament Test
 */
define([ '../kotournament', '../game', '../tournament', '../../lib/implements' ], function (KOTournament, Game, Tournament, Interface) {
  QUnit.test("KOTournament", function () {
    var i, names, kot, opts;

    QUnit.equal(Interface(Tournament), '', 'Tournament interface validation');
    QUnit.equal(Interface(Tournament, KOTournament, 'rfm'), '', 'KOTournament interface match');

    names = [ 'Antje', 'Basta', 'Christian', 'David', 'Erik', 'Fabe', 'Gert',
        'Hartmut', 'Inka', 'Jennifer' ];

    kot = new KOTournament();
    for (i in names) {
      kot.addPlayer(Number(i));
    }

    opts = kot.getOptions();
    opts.matchingMethod = KOTournament.OPTIONS.matchingMethod.set;
    opts.loserMatchMinRound = 1;
    kot.setOptions(opts);
    kot.start();

    while (kot.getState() === Tournament.STATE.RUNNING) {
      kot.finishGame(kot.getGames()[0], [ 13, 0 ]);
      // FIXME visual investigation shows too few 'third place' matches
    }

    return;
  });
});
