/**
 * KOTreeView
 *
 * @return KOTreeView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './listview', './komatchresultview',
    'core/matchmodel', 'core/kotournamentmodel'], function(extend,
    TemplateView, ListView, KOMatchResultView, MatchModel, KOTournamentModel) {
  /**
   * Constructor
   *
   * @param tournament
   *          a TournamentModel instance
   * @param $view
   *          the table
   * @param groups
   *          a BinningReferenceListModel of MatchReferenceModels which are
   *          grouped by their match group
   * @param teamlist
   *          a ListModel of TeamModel instances
   * @param teamsize
   *          a ValueModel which represents the size of all registered teams
   */
  function KOTreeView(model, $view, teamlist, tournament, teamsize) {
    KOTreeView.superconstructor.call(this, model, $view, $view
        .find('.komatchresult.template'));

    this.tournament = tournament;
    this.$forest = this.$view.find('.forest');

    this.matches = new ListView(this.model, this.$forest, this.$template,
        KOMatchResultView, teamlist, tournament, undefined);

    this.setSize();
  }
  extend(KOTreeView, TemplateView);

  KOTreeView.prototype.setSize = function() {
    var group, thirdPlaceMatch, lowestMatch, lowestID, firstRound, x, y;

    group = this.model.get(0).getGroup() & ~0x1;

    firstRound = Math.min(//
    KOTournamentModel.initialRoundForTeams(this.tournament.getTeams().length), //
    KOTournamentModel.roundsInGroup(group & ~0x1) - 1 //
    );

    lowestID = KOTournamentModel.firstMatchIDOfRound(firstRound + 1) - 1;

    // TODO think of a prettier way
    lowestMatch = new MatchModel([undefined, undefined], lowestID, group);
    thirdPlaceMatch = new MatchModel([undefined, undefined], 1, group + 1);

    // TODO think of a prettier way
    lowestMatch = new KOMatchResultView(lowestMatch, undefined, undefined,
        this.tournament, undefined);
    thirdPlaceMatch = new KOMatchResultView(thirdPlaceMatch, undefined,
        undefined, this.tournament, undefined);

    x = thirdPlaceMatch.x;
    y = Math.max(lowestMatch.y, thirdPlaceMatch.y);

    x += KOMatchResultView.width;
    y += KOMatchResultView.height;

    this.$forest.css('width', x + 'em');
    this.$forest.css('height', y + 'em');
  };

  return KOTreeView;
});
