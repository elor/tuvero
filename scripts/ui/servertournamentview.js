/**
 * ServerTournamentView
 *
 * @return ServerTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import View from '../core/view.js';
import ServerTournamentController from './servertournamentcontroller.js';
/**
 * Constructor
 */
function ServerTournamentView(model, $view) {
  ServerTournamentView.superconstructor.call(this, model, $view);
  this.$view.find('.name').text(model.name);
  this.$view.find('.place').text(model.place);
  this.$view.find('.creator').text(model.creator);
  this.$view.find('.teamsize').text(model.teamsize);
  this.$view.find('.url').text(model.url_www);
  this.$view.find('a.url_href').attr('href', model.url_www);
  this.controller = new ServerTournamentController(this);
}
extend(ServerTournamentView, View);
export default ServerTournamentView;