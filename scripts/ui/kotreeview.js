/**
 * KOTreeView
 *
 * @return KOTreeView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './listview', './inlinelistview',
    './komatchresultview', 'core/kotournamentmodel', './kotreeposition',
    './kolineview', './boxview'], function(extend, TemplateView, ListView,
    InlineListView, KOMatchResultView, KOTournamentModel, KOTreePosition,
    KOLineView, BoxView) {
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
   * @param showNames
   *          a ValueModel which evaluates to true if names should be shown
   */
  function KOTreeView(model, $view, teamlist, tournament, teamsize, showNames) {
    KOTreeView.superconstructor.call(this, model, $view, $view
        .find('.komatchresult.template'));

    this.group = this.model.get(0).getGroup() & ~0x1;
    this.boxView = new BoxView(this.$view);

    this.showNames = showNames;
    this.tournament = tournament;
    this.$forest = this.$view.find('.forest');
    this.$kolineanchor = this.$forest.find('.kolineanchor');
    this.$bestrank = this.$view.find('.bestrank');

    this.lines = new InlineListView(this.model, this.$kolineanchor,
        this.$kolineanchor.clone(), KOLineView, tournament.getTeams().length,
        showNames);

    this.matches = new ListView(this.model, this.$forest, this.$template,
        KOMatchResultView, teamlist, tournament, showNames);

    this.updateGroupInformation();
    this.setSize();

    showNames.registerListener(this);
  }
  extend(KOTreeView, TemplateView);

  /**
   * print the best possible rank for this group
   */
  KOTreeView.prototype.updateGroupInformation = function() {
    var bestrank = this.group * 2 + 1;

    this.$bestrank.text(bestrank);
  };

  /**
   * set the size of $forest to match the tree. It's necessary since the tree
   * nodes are absolutely positioned, so the div doesn't flow around them
   * automatically.
   */
  KOTreeView.prototype.setSize = function() {
    var numTeams, numRounds, thirdPlacePos, lowestPos, x, y, isTopAligned;

    numTeams = this.tournament.getTeams().length;

    thirdPlacePos = new KOTreePosition(1, this.group + 1, numTeams,
        this.showNames.get());

    lowestID = KOTournamentModel
        .firstMatchIDOfRound(thirdPlacePos.firstRound + 1) - 1;
    lowestPos = new KOTreePosition(lowestID, this.group, numTeams,
        this.showNames.get());

    if (this.group === 0) {
      numRounds = KOTournamentModel.initialRoundForTeams(numTeams) + 1;
    } else {
      numRounds = KOTournamentModel.roundsInGroup(this.group);
    }

    isTopAligned = KOTournamentModel.numMatchesInRound(numRounds) == numTeams;

    x = thirdPlacePos.x;
    y = Math.max(lowestPos.y, thirdPlacePos.y);

    x += KOTreePosition.getWidth(this.showNames.get());
    y += KOTreePosition.HEIGHT;

    this.$forest.css('width', x + 'em');
    this.$forest.css('height', y + 'em');
    this.$forest.css('margin-top', isTopAligned ? '0em' : '-2.5em');
  };

  /**
   * 'update'-listener for showNames
   *
   * @param emitter ==
   *          this.showNames
   * @param event ==
   *          'update'
   * @param data
   *          a data object
   */
  KOTreeView.prototype.onupdate = function(emitter, event, data) {
    this.setSize();
  };

  return KOTreeView;
});
