/**
 * KOTreeView
 *
 * @return KOTreeView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './listview', './inlinelistview',
    './komatchresultview', 'core/matchmodel', 'core/kotournamentmodel',
    './kotreeposition', './kolineview'], function(extend, TemplateView,
    ListView, InlineListView, KOMatchResultView, MatchModel, KOTournamentModel,
    KOTreePosition, KOLineView) {
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
    this.$kolineanchor = this.$forest.find('.kolineanchor').removeClass(
        'kolineanchor');

    this.lines = new InlineListView(this.model, this.$kolineanchor,
        this.$kolineanchor.clone(), KOLineView, tournament.getTeams().length);

    this.matches = new ListView(this.model, this.$forest, this.$template,
        KOMatchResultView, teamlist, tournament, undefined);

    this.setSize();
  }
  extend(KOTreeView, TemplateView);

  KOTreeView.prototype.setSize = function() {
    var numTeams, group, thirdPlacePos, lowestPos, x, y;

    numTeams = this.tournament.getTeams().length;
    group = this.model.get(0).getGroup() & ~0x1;

    thirdPlacePos = new KOTreePosition(1, group + 1, numTeams);

    lowestID = KOTournamentModel
        .firstMatchIDOfRound(thirdPlacePos.firstRound + 1) - 1;
    lowestPos = new KOTreePosition(lowestID, group, numTeams);

    x = thirdPlacePos.x;
    y = Math.max(lowestPos.y, thirdPlacePos.y);

    x += KOTreePosition.WIDTH;
    y += KOTreePosition.HEIGHT;

    this.$forest.css('width', x + 'em');
    this.$forest.css('height', y + 'em');
  };

  return KOTreeView;
});
