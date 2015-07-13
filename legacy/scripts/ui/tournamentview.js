/**
 * TournamentView
 *
 * @return TournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './stateclassview'], function(extend, View,
    StateClassView) {
  /**
   * Constructor
   */
  function TournamentView(model, $view) {
    TournamentView.superconstructor.call(this, model, $view);

    this.stateClassView = new StateClassView(model.getState(), $view);

    this.$initial = this.$view.find('.initial');
    this.$running = this.$view.find('.running');
    this.$idle = this.$view.find('.idle');
    this.$finished = this.$view.find('.finished');
  }
  extend(TournamentView, View);

  return TournamentView;
});
