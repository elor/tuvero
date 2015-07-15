/**
 * TournamentView
 *
 * @return TournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './stateclassview', './tournamentcontroller'//
], function(extend, View, StateClassView, TournamentController) {
  /**
   * Constructor
   *
   * @param model
   *          a TournamentModel instance
   * @param $view
   */
  function TournamentView(model, $view) {
    TournamentView.superconstructor.call(this, model, $view);

    this.stateClassView = new StateClassView(model.getState(), $view);

    this.$name = this.$view.find('.tournamentname');

    this.$initial = this.$view.find('.initial');
    this.$running = this.$view.find('.running');
    this.$idle = this.$view.find('.idle');
    this.$finished = this.$view.find('.finished');

    this.updateName();

    this.controller = new TournamentController(this);
  }
  extend(TournamentView, View);

  TournamentView.prototype.updateName = function() {
    this.$name.text(this.model.SYSTEM);
  };

  return TournamentView;
});
