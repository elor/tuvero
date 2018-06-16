/**
 * TournamentView
 *
 * @return TournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/view', 'ui/stateclassview', 'core/listener',
    'ui/tournamentcontroller', 'list/listmodel', 'ui/boxview', 'presets',
    'ui/rankingorderview', 'ui/strings'], function($, extend, View, StateClassView,
    Listener, TournamentController, ListModel, BoxView, Presets,
    RankingOrderView, Strings) {
  /**
   * Constructor
   *
   * @param model
   *          a TournamentModel instance
   * @param $view
   */
  function TournamentView(tournament, $view, tournaments) {
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

    this.$initial = this.$view.find('.initial');
    this.$running = this.$view.find('.running');
    this.$idle = this.$view.find('.idle');
    this.$finished = this.$view.find('.finished');

    this.$advancedOptions = this.$view.find('.tournamentoptions.boxview');
    if (this.$advancedOptions.length > 0) {
      this.advancedOptions = $advancedOptions = [];
      this.$advancedOptions.each(function() {
        $advancedOptions.push(new BoxView($(this)));
      });
    }

    this.initRankingOrderView();

    Listener.bind(this.model.tournament.getName(), 'update', this.updateNames
        .bind(this));

    this.updateNames();
    this.updateRound();

    this.controller = new TournamentController(this, tournaments);
  }
  extend(TournamentView, View);

  /**
   * initiate a RankingOrderView, if necessary
   */
  TournamentView.prototype.initRankingOrderView = function() {
    var availableComponents;

    this.$rankingOrderView = this.$view.find('.rankingorderview');
    if (this.$rankingOrderView.length > 0) {
      availableComponents = Presets.ranking.components.slice(0);
      this.model.tournament.getRanking().get().components.forEach(function(
          component) {
        if (availableComponents.indexOf(component) === -1) {
          availableComponents.push(component);
        }
      });

      availableComponents.sort(function(a, b) {
        a = Strings['ranking_' + a] || a;
        b = Strings['ranking_' + b] || b;
        return a.localeCompare(b);
      });

      this.rankingOrderView = new RankingOrderView(this.model.rankingOrder,
          this.$rankingOrderView.eq(0), new ListModel(availableComponents));
    }
  };

  /**
   * update the displayed tournament name
   */
  TournamentView.prototype.updateNames = function() {
    this.$name.text(this.model.tournament.getName().get());
  };

  /**
   * update the displayed tournament round
   */
  TournamentView.prototype.updateRound = function() {
    if (this.model.tournament.getRound) {
      this.$round.text(this.model.tournament.getRound() + 1);
      this.$nextround.text(this.model.tournament.getRound() + 2);
    }
  };

  TournamentView.prototype.onstate = function() {
    this.updateRound();
  };

  TournamentView.prototype.destroy = function() {
    this.controller.destroy();
    if (this.subcontroller && this.subcontroller.destroy) {
      this.subcontroller.destroy();
    }

    if (this.rankingOrderView) {
      this.rankingOrderView.destroy();
    }

    this.stateClassView.destroy();

    TournamentView.superclass.destroy.call(this);
  };

  return TournamentView;
});