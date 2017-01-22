/**
 * ServerTournamentModel
 *
 * @return ServerTournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model'], function(extend, Model) {
  /**
   * Constructor
   */
  function ServerTournamentModel(server, data) {
    ServerTournamentModel.superconstructor.call(this);

    this.id = data.id || undefined;
    this.name = data.name;
    this.place = data.place;
    this.creator = data.creator_name;
    this.teamsize = data.teamsize;
    this.variant = data.target;
    this.www_url = data.url_www;

    this.registration = [];

    this.server = server;

    this.server.registerListener(this);
  }
  extend(ServerTournamentModel, Model);

  ServerTournamentModel.prototype.EVENTS = {
    'error' : true,
    'ready' : true
  }

  ServerTournamentModel.prototype.readRegistrations = function() {
    var message = this.server.message('t/' + this.id);

    message.onreceive = (function(emitter, event, data) {
      if (data.registrations) {
        this.registrations = data.registrations;
        this.emit('ready');
      } else {
        this.emit('error');
      }
    }).bind(this);
    message.onerror = (function() {
      this.emit('error');
    }).bind(this);

    message.send();
  };

  return ServerTournamentModel;
});
