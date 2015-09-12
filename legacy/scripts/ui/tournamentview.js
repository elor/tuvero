/**
 * TournamentView
 *
 * @return TournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './stateclassview', 'core/listener',
    './tournamentcontroller', 'core/listmodel', './boxview',
    './rankingorderview', 'core/rankingcomponentindex', './strings'], function(
    extend, View, StateClassView, Listener, TournamentController, ListModel,
    BoxView, RankingOrderView, RankingComponentIndex, Strings) {
  /**
   * Constructor
   *
   * @param model
   *          a TournamentModel instance
   * @param $view
   */
  function TournamentView(tournament, $view) {
    var $advancedOptions;
    TournamentView.superconstructor.call(this, undefined, $view);

    this.$view.attr('rowspan', tournament.getTeams().length);

    this.model.tournament = tournament;
    this.model.rankingOrder = new ListModel(
        this.model.tournament.ranking.componentnames);

    this.stateClassView = new StateClassView(tournament.getState(), $view);

    this.$name = this.$view.find('.tournamentname');
    this.$round = this.$view.find('.round');
    this.$nextround = this.$view.find('.nextround');

    this.$advancedOptions = this.$view.find('.tournamentoptions.boxview');
    if (this.$advancedOptions.length > 0) {
      this.advancedOptions = $advancedOptions = [];
      this.$advancedOptions.each(function() {
        $advancedOptions.push(new BoxView($(this)));
      });
    }

    this.$rankingOrderView = this.$view.find('.rankingorderview');
    if (this.$rankingOrderView.length > 0) {
      this.rankingOrderView = new RankingOrderView(this.model.rankingOrder,
          this.$rankingOrderView.eq(0), new ListModel(
              RankingComponentIndex.components.slice().sort(function(a, b) {
                a = Strings['ranking_' + a] || a;
                b = Strings['ranking_' + b] || b;
                return a.localeCompare(b);
              })));
      this.rankingOrderView.availableListView.model.erase('headtohead');
      this.rankingOrderView.availableListView.model.erase('id');

    }

    this.$initial = this.$view.find('.initial');
    this.$running = this.$view.find('.running');
    this.$idle = this.$view.find('.idle');
    this.$finished = this.$view.find('.finished');

    Listener.bind(this.model.tournament.getName(), 'update', this.updateNames
        .bind(this));

    this.updateNames();
    this.updateRound();

    this.controller = new TournamentController(this);
  }
  extend(TournamentView, View);

  TournamentView.prototype.updateNames = function() {
    this.$name.text(this.model.tournament.getName().get());
  };

  TournamentView.prototype.updateRound = function() {
    if (this.model.tournament.getRound) {
      this.$round.text(this.model.tournament.getRound() + 1);
      this.$nextround.text(this.model.tournament.getRound() + 2);
    }
  };

  TournamentView.prototype.onstate = function() {
    this.updateRound();
  };

  return TournamentView;
});
