/**
 * SwissMaxRoundView
 *
 * @return SwissMaxRoundView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'core/valuemodel', 'ui/valueview',
    'core/propertyvaluemodel', 'core/listener', 'tournament/swisstournamentmodel'], //
function(extend, View, ValueModel, ValueView, PropertyValueModel, Listener,
    SwissTournamentModel) {
  /**
   * Constructor
   */
  function SwissMaxRoundView(model, $view) {
    SwissMaxRoundView.superconstructor.call(this, model, $view);

    this.maxrounds = new ValueModel(0);
    this.maxroundsview = new ValueView(this.maxrounds, this.$view
        .find('.maxrounds'));

    this.teams = this.model.getTeams();

    this.$view.find('.numteams').text(this.teams.length);

    this.mode = new PropertyValueModel(this.model, 'swissmode');

    this.modeListener = Listener.bind(this.mode, 'update', this.update
        .bind(this));

    this.update();
  }
  extend(SwissMaxRoundView, View);

  SwissMaxRoundView.prototype.update = function() {
    switch (this.mode.get()) {
    case SwissTournamentModel.MODES.wins:
      this.maxrounds.set(Math.ceil(Math.log(this.teams.length) / Math.log(2)));
      break;
    default:
      this.maxrounds.set(this.teams.length - 1);
      break;
    }
  };

  SwissMaxRoundView.prototype.destroy = function() {

    this.modeListener.destroy();
    this.mode.destroy();
    this.maxroundsview.destroy();
    this.maxrounds.destroy();

    SwissMaxRoundView.superclass.destroy.call(this);
  };

  return SwissMaxRoundView;
});
