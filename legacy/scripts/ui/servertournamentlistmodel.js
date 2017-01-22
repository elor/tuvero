/**
 * ServerTournamentListModel
 *
 * @return ServerTournamentListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listmodel'], function(extend, ListModel) {
  /**
   * Constructor
   */
  function ServerTournamentListModel(server) {
    ServerTournamentListModel.superconstructor.call(this);

    this.server = server;

    this.server.registerListener(this);
  }
  extend(ServerTournamentListModel, ListModel);

  ServerTournamentListModel.prototype.parseResult = function(data) {
    this.clear();
    console.log(data);
  };

  ServerTournamentListModel.prototype.update = function() {
    var message = this.server.message('t');

    message.onreceive = (function(emitter, event, data) {
      if (data) {
        this.parseResult(data);
      }
    }).bind(this);
    message.onerror = this.clear.bind(this)

    message.send();
  };

  ServerTournamentListModel.prototype.onlogin = function() {
    this.update();
  };

  ServerTournamentListModel.prototype.onlogout = function() {
    this.clear();
  };

  ServerTournamentListModel.prototype.onerror = function() {
    this.clear();
  };

  return ServerTournamentListModel;
});
