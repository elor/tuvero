/**
 * ServerAutoloadModel
 *
 * @return ServerAutoloadModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'ui/browser', 'ui/servertournamentmodel',
  'ui/servertournamentloader', 'presets', 'core/listener'], function (extend, Model, Browser,
    ServerTournamentModel, ServerTournamentLoader, Presets, Listener) {
    /**
     * Constructor
     */
    function ServerAutoloadModel(server) {
      ServerAutoloadModel.superconstructor.call(this);

      this.server = server;
      this.tournamentID = this.readTournamentID();

      this.server.registerListener(this);

    }
    extend(ServerAutoloadModel, Model);

    ServerAutoloadModel.prototype.readTournamentID = function () {
      var testresult;
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
     */
    ServerAutoloadModel.prototype.onlogin = function () {
      var message;
      if (this.tournamentID) {

        message = this.server.message('t/' + this.tournamentID);
        message.onreceive = (function (emitter, event, data) {
          if (data && data.registrations && data.target === Presets.target) {
            var model = new ServerTournamentModel(this.server, data);

            Listener.bind(model, 'ready', function () {
              ServerTournamentLoader.loadTournament(model);
            });
            model.downloadState();

            if (window.location.hash.replace(/^#/, '') === Browser.inithash) {
              window.location.hash = '';
            }
          }
        }).bind(this);
        message.send();
      }
    };

    return ServerAutoloadModel;
  });
