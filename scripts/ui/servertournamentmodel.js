import Model from '../core/model.js';

/**
 * Constructor
 */
class ServerTournamentModel extends Model {
  constructor(server, data) {
    super();
    this.id = data.id || undefined;
    this.name = data.name;
    this.place = data.place;
    this.creator = data.creator_name;
    this.teamsize = data.teamsize;
    this.variant = data.target;
    this.url_www = data.url_www;
    this.statejson = undefined;
    this.server = server;
    this.server.registerListener(this);
  }

  downloadState() {
    const message = this.server.message('t/' + this.id + '/state/latest/state');
    message.onreceive = function (emitter, event, statejson) {
      if (!statejson.error) {
        this.statejson = statejson;
        this.emit('ready');
      } else {
        this.emit('error');
      }
    }.bind(this);
    message.onerror = function () {
      this.emit('error');
    }.bind(this);
    message.send();
  }
}

ServerTournamentModel.prototype.EVENTS = {
  'error': true,
  'ready': true
};
export default ServerTournamentModel;