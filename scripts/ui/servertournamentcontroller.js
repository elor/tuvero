/**
 * ServerTournamentController
 *
 * @return ServerTournamentController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
import Listener from '../core/listener.js';
import ServerTournamentLoader from './servertournamentloader.js';
/**
 * Constructor
 */
function ServerTournamentController(view) {
  ServerTournamentController.superconstructor.call(this, view);
  this.view.$view.find('button.play').click(this.model.downloadState.bind(this.model));
  Listener.bind(this.model, 'ready', function () {
    ServerTournamentLoader.loadTournament(this.model);
  }, this);
}
extend(ServerTournamentController, Controller);
export default ServerTournamentController;