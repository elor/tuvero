/**
 * ServerTournamentListModel
 *
 * @return ServerTournamentListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listmodel', 'ui/servertournamentmodel', //
'presets'], function(extend, ListModel, ServerTournamentModel, Presets) {
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

    Object.keys(data.tournaments).forEach(function(tournamentID) {
      var tournament, tournamentData;
      tournamentData = data.tournaments[tournamentID];
      if (tournamentData.target == Presets.target) {
        tournament = new ServerTournamentModel(this.server, tournamentData);
        this.push(tournament);
      }
    }, this);
  };

  ServerTournamentListModel.prototype.update = function() {
    var message = this.server.message('t');

    message.onreceive = (function(emitter, event, data) {
      this.parseResult(data);
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
