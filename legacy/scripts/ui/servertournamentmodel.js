
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
    this.www_url = data.www_url;
    this.api_url = data.api_url;

    this.server = server;

    this.server.registerListener(this);
  }
  extend(ServerTournamentModel, Model);

  return ServerTournamentModel;
});
