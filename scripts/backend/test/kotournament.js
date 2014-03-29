/*
 * KOTournament Test
 */
define([ '../kotournament', '../game', '../tournament', '../../lib/implements' ], function (KOTournament, Game, Tournament, Interface) {
  QUnit.test("KOTournament", function () {
    var st, corr, count, pid, valid, games1, games2, games3, rnk, res, tmp;

    QUnit.equal(Interface(Tournament), '', 'Tournament interface validation');
    QUnit.equal(Interface(Tournament, KOTournament, 'rfm'), '', 'KOTournament interface match');

    return;
  });
});
