import Controller from '../core/controller.js';
import State from './state.js';
import Toast from './toast.js';
import Strings from './strings.js';

class PlayerSettingsController extends Controller {
  constructor(view, teamref) {
    super(view, teamref);
    this.teamref = teamref;
    this.reset = this.reset.bind(this);
    this.update = this.update.bind(this);
    this.enterkey = function (e) {
      if (e.which === 13) {
        this.update();
      }
    }.bind(this);
    this.register();
  }

  register() {
    this.view.$view.on('click', 'button.reset', this.reset);
    this.view.$view.on('click', 'button.update', this.update);
    this.view.$view.on('keypress', 'input', this.enterkey);
  }

  unregister() {
    this.view.$view.off('click', 'button.reset', this.reset);
    this.view.$view.off('click', 'button.update', this.update);
    this.view.$view.off('keypress', 'input', this.enterkey);
  }

  reset() {
    this.view.update();
    Toast.once(Strings.team_settings_reset);
  }

  update() {
    this.model.firstname = this.view.$view.find('.firstname').val();
    this.model.lastname = this.view.$view.find('.lastname').val();
    this.model.club = this.view.$view.find('.club').val();
    this.model.email = this.view.$view.find('.email').val();
    this.model.license = this.view.$view.find('.license').val();
    this.model.rankingpoints = Number(this.view.$view.find('.rankingpoints').val());
    this.model.elo = Number(this.view.$view.find('.elo').val());
    Toast.once(Strings.team_settings_updated);
    if (this.teamref.team) {
      this.teamref.team.updateRankingPointSum();
    }
    this.model.setName(this.view.$view.find('.alias').val());
    this.model.emit('update');
  }

  destroy() {
    this.unregister();
    super.destroy();
  }
}

export default PlayerSettingsController;