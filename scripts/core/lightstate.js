/**
 * A class for collecting all necessary state information of one or more running
 * tournaments.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'list/indexedlistmodel', 'core/valuemodel',
  'ui/listcleanuplistener', 'tournament/tournamentlistmodel', 'presets',
  'ui/teammodel', 'core/listener', 'core/type', 'ui/playermodel'], function (extend, Model, IndexedListModel,
    ValueModel, ListCleanupListener, TournamentListModel, Presets, TeamModel, Listener, Type, PlayerModel) {
    function LightState() {
      LightState.superconstructor.call(this);

      this.teams = new IndexedListModel();
      this.teamscleanuplistener = new ListCleanupListener(this.teams);

      this.tournaments = new TournamentListModel();
      this.tournamentscleanuplistener = new ListCleanupListener(this.tournaments);

      this.serverlink = new ValueModel(undefined);

      this.transitions = [];
    }
    extend(LightState, Model);

    LightState.prototype.do = function (transition) {
      if (Type.isFunction(this.transitionFunctions[transition.action])) {
        this.transitionFunctions[transition.action].call(this, transition);
        this.transitions.push(JSON.parse(JSON.stringify(transition)));
      } else {
        throw 'Invalid transition';
      }

      return this;
    };

    LightState.prototype.transitionFunctions = {
      "team:add": function (transition) {
        if (Type.isString(transition.players)) {
          transition.players = [transition.players];
        }
        if (!Type.isArray(transition.players) || !transition.players.length
          || !transition.players.every(player => Type.isString(player))) {
          throw 'No player given or invalid format';
        }

        this.teams.push(new TeamModel(
          transition.players.map(name => new PlayerModel(name))
        ));
      },
      "team:remove": function (transition) {
        this.teams.remove(transition.index);
      }
    };





























    LightState.prototype.SAVEFORMAT = Object
      .create(LightState.superclass.SAVEFORMAT);
    LightState.prototype.SAVEFORMAT.teams = [Object];
    LightState.prototype.SAVEFORMAT.teamsize = Number;
    LightState.prototype.SAVEFORMAT.tournaments = Object;
    LightState.prototype.SAVEFORMAT.target = String; // e.g. 'tac', 'boule', ...
    LightState.prototype.SAVEFORMAT.version = String; // e.g. '1.5.8'
    LightState.prototype.SAVEFORMAT.transitions = Object;
    // LightState.prototype.SAVEFORMAT.serverlink = String; // OPTIONAL alphanumeric serverside identifier

    LightState.prototype.save = function () {
      var data = LightState.superclass.save.call(this);

      data.teams = this.teams.save();
      data.teamsize = this.teamsize.get();
      data.tournaments = this.tournaments.save();
      data.serverlink = this.serverlink.get();
      data.transitions = this.transitions;

      // This reflects the json schema version for now.
      data.version = '1.5.8';

      data.target = Presets.target;

      return data;
    };

    LightState.prototype.restore = function (data) {
      if (!LightState.superclass.restore.call(this, data)) {
        return false;
      }

      if (Presets.target !== data.target) {
        return false;
      }

      this.teamsize.set(data.teamsize);

      if (!this.teams.restore(data.teams, TeamModel)) {
        this.emit('error', 'error: cannot restore State.teams');
        return false;
      }

      if (!this.tournaments.restore(data.tournaments)) {
        this.emit('error', 'error: cannot restore State.tournaments');
        return false;
      }

      this.serverlink.set(data.serverlink || undefined);
      this.transitions = data.transitions;

      return true;
    };

    return LightState;
  });
