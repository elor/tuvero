import View from '../core/view.js';
import ValueModel from '../core/valuemodel.js';
import ValueView from './valueview.js';
import PropertyValueModel from '../core/propertyvaluemodel.js';
import Listener from '../core/listener.js';
import SwissTournamentModel from '../tournament/swisstournamentmodel.js';

/**
 * Constructor
 */
class SwissMaxRoundView extends View {
  constructor(model, $view) {
    super(model, $view);
    this.maxrounds = new ValueModel(0);
    this.maxroundsview = new ValueView(this.maxrounds, this.$view.find('.maxrounds'));
    this.teams = this.model.getTeams();
    this.$view.find('.numteams').text(this.teams.length);
    this.mode = new PropertyValueModel(this.model, 'swissmode');
    this.modeListener = Listener.bind(this.mode, 'update', this.update.bind(this));
    this.update();
  }

  update() {
    switch (this.mode.get()) {
      case SwissTournamentModel.MODES.wins:
        this.maxrounds.set(Math.ceil(Math.log(this.teams.length) / Math.log(2)));
        break;
      default:
        this.maxrounds.set(this.teams.length - 1);
        break;
    }
  }

  destroy() {
    this.modeListener.destroy();
    this.mode.destroy();
    this.maxroundsview.destroy();
    this.maxrounds.destroy();
    super.destroy();
  }
}

export default SwissMaxRoundView;