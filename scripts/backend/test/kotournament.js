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
    opts.matchingMethod = KOTournament.OPTIONS.matchingMethod.shifted;
    opts.loserMatchMinRound = 1;
    kot.setOptions(opts);
    console.log(kot.start());

    return;
  });
});
