/**
 * ServerAutoloadModel
 *
 * @return ServerAutoloadModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import Model from '../core/model.js';
import Browser from './browser.js';
import ServerTournamentModel from './servertournamentmodel.js';
import ServerTournamentLoader from './servertournamentloader.js';
import Presets from 'presets';
import Listener from '../core/listener.js';
/**
 * Constructor
 *
 * @param  {ServerModel} server the currently active ServerModel instance
 * @returns {undefined}
 */
function ServerAutoloadModel(server) {
  ServerAutoloadModel.superconstructor.call(this);
  this.server = server;
  this.tournamentID = this.readTournamentID();
  this.server.registerListener(this);
}
extend(ServerAutoloadModel, Model);
ServerAutoloadModel.prototype.readTournamentID = function () {
  let testresult;
  if (Browser.inithash) {
    testresult = Browser.inithash.match(/^\/?t\/([0-9a-f]+)$/);
    if (testresult && testresult[0] && testresult[1]) {
      return testresult[1];
    }
  }
  return undefined;
};

/**
 * event function
 *
 * @returns {undefined}
 */
ServerAutoloadModel.prototype.onlogin = function () {
  let message;
  if (this.tournamentID) {
    message = this.server.message('t/' + this.tournamentID);
    message.onreceive = function (emitter, event, data) {
      if (data && data.registrations && data.target === Presets.target) {
        const model = new ServerTournamentModel(this.server, data);
        Listener.bind(model, 'ready', function () {
          ServerTournamentLoader.loadTournament(model);
        });
        model.downloadState();
        if (window.location.hash.replace(/^#/, '') === Browser.inithash) {
          window.location.hash = '';
        }
      }
    }.bind(this);
    message.send();
  }
};
export default ServerAutoloadModel;