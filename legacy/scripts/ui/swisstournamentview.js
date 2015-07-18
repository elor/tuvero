/**
 * SwissTournamentView
 *
 * @return SwissTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './tournamentview', './swisstournamentcontroller',
    './boxview', './rankingorderview', 'core/listmodel',
    'core/rankingcomponentindex', './strings'], function(extend,
    TournamentView, SwissTournamentController, BoxView, RankingOrderView,
    ListModel, RankingComponentIndex, Strings) {
  /**
   * Constructor
   *
   * @param model
   *          a SwissTournamentModel instance
   * @param $view
   *          a jquery DOM element
   */
  function SwissTournamentView(model, $view) {
    SwissTournamentView.superconstructor.call(this, model, $view);

    this.$round = this.$view.find('.round');
    this.$nextround = this.$view.find('.nextround');

    this.advancedOptions = new BoxView(this.$view.find('.boxview'));

    this.selectedRankingComponents = new ListModel('wins');

    this.rankingorderview = new RankingOrderView(
        this.selectedRankingComponents, this.$view.find('.rankingorderview'),
        new ListModel(RankingComponentIndex.components.slice().sort(
            function(a, b) {
              a = Strings['ranking_' + a] || a;
              b = Strings['ranking_' + b] || b;
              return a.localeCompare(b);
            })));

    this.controller = new SwissTournamentController(this);

    this.updateRound();
  }
  extend(SwissTournamentView, TournamentView);

  SwissTournamentView.prototype.updateRound = function() {
    this.$round.text(this.model.getRound() + 1);
    this.$nextround.text(this.model.getRound() + 2);
  };

  SwissTournamentView.prototype.onstate = function() {
    this.updateRound();
  };

  return SwissTournamentView;
});
