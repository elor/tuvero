/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

/*
 * KOTournament Test
 */
define(function() {
  return function(QUnit, getModule) {
    var KOTournament, Game, Tournament, Implements;

    KOTournament = getModule('backend/kotournament');
    Game = getModule('backend/game');
    Tournament = getModule('backend/tournament');
    Implements = getModule('lib/implements');

    QUnit.test('KOTournament', function() {
      var i, names, kot, opts;

      QUnit.equal(Implements(Tournament), '', 'Tournament interface validation');
      QUnit.equal(Implements(Tournament, KOTournament, 'rfm'), '', 'KOTournament interface match');

      names = ['Antje', 'Basta', 'Christian', 'David', 'Erik', 'Fabe', 'Gert',
          'Hartmut', 'Inka', 'Jennifer'];

      kot = new KOTournament();
      for (i in names) {
        kot.addPlayer(Number(i));
      }

      opts = kot.getOptions();
      opts.matchingMethod = KOTournament.OPTIONS.firstround.set;
      opts.loserMatchMinRound = 1;
      kot.setOptions(opts);
      kot.start();

      while (kot.getState() === Tournament.STATE.RUNNING) {
        kot.finishGame(kot.getGames()[0], [13, 0]);
      }

      return;
    });
  };
});
