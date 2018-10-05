/**
 * ServerTournamentModel
 *
 * @return ServerTournamentModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "core/model"], function (extend, Model) {
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
    this.url_www = data.url_www;

    this.statejson = undefined;

    this.server = server;

    this.server.registerListener(this);
  }
  extend(ServerTournamentModel, Model);

  ServerTournamentModel.prototype.EVENTS = {
    "error": true,
    "ready": true
  };

  ServerTournamentModel.prototype.downloadState = function () {
    var message = this.server.message("t/" + this.id + "/state/latest/state");

    message.onreceive = (function (emitter, event, statejson) {
      if (!statejson.error) {
        this.statejson = statejson;
        this.emit("ready");
      } else {
        this.emit("error");
      }
    }).bind(this);
    message.onerror = (function () {
      this.emit("error");
    }).bind(this);

    message.send();
  };

  return ServerTournamentModel;
});
