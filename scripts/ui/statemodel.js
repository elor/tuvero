/**
 * A class for collecting all necessary state information of one or more running
 * tournaments.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "core/model", "list/indexedlistmodel", "core/valuemodel",
  "ui/listcleanuplistener", "tournament/tournamentlistmodel", "options", "presets",
  "ui/teammodel", "core/listener"
], function (extend, Model, IndexedListModel,
  ValueModel, ListCleanupListener, TournamentListModel, Options, Presets,
  TeamModel, Listener) {

  function StateModel() {
    StateModel.superconstructor.call(this);
    // actual state
    this.teams = new IndexedListModel();
    this.teamsize = new ValueModel(Presets.registration.defaultteamsize || Presets.registration.minteamsize);
    this.tournaments = new TournamentListModel();
    this.serverlink = new ValueModel(undefined);

    function tabOptionPreset(name, defaultValue) {
      if (!Presets.taboptions || Presets.taboptions[name] === undefined) {
        return new ValueModel(defaultValue);
      }

      // cast to bool, just in case.
      return new ValueModel(!!Presets.taboptions[name]);
    }

    this.tabOptions = {
      showNames: tabOptionPreset("shownames", true),
      nameMaxWidth: tabOptionPreset("namemaxwidth", true),
      teamTable: tabOptionPreset("teamtable", true),
      rankingAbbreviations: tabOptionPreset("rankingabbreviations", false),
      showMatchTables: tabOptionPreset("showmatchtables", false),
      hideFinishedGroups: tabOptionPreset("hidefinishedgroups", false),
      autouploadState: tabOptionPreset("autouploadstate", false)
    };

    this.focusedteam = new ValueModel(undefined); // Holds a TeamModel reference

    this.initCleanupListeners();
  }
  extend(StateModel, Model);

  StateModel.prototype.EVENTS = {
    error: true,
    clear: true
  };

  /**
   * whenever an element is removed from those central and elemental lists, call
   * its destroy() function
   *
   * @returns {undefined}
   */
  StateModel.prototype.initCleanupListeners = function () {
    this.teamscleanuplistener = new ListCleanupListener(this.teams);
    this.tournamentscleanuplistener = new ListCleanupListener( //
      this.tournaments);
  };

  /**
   * reset the state of everything
   *
   * @returns {undefined}
   */
  StateModel.prototype.clear = function () {
    this.tournaments.clear();
    this.teams.clear();
    Options.reset();
    this.emit("clear");

    // explicit rule to avoid uploading an already existing state
    this.tabOptions.autouploadState.set(false);

    this.teamsize.set(Presets.registration.defaultteamsize || Presets.registration.minteamsize);
  };

  StateModel.prototype.SAVEFORMAT = Object
    .create(StateModel.superclass.SAVEFORMAT);
  StateModel.prototype.SAVEFORMAT.options = Object;
  StateModel.prototype.SAVEFORMAT.teams = [Object];
  StateModel.prototype.SAVEFORMAT.teamsize = Number;
  StateModel.prototype.SAVEFORMAT.tournaments = Object;
  StateModel.prototype.SAVEFORMAT.target = String; // e.g. 'tac', 'boule', ...
  StateModel.prototype.SAVEFORMAT.version = String; // e.g. '1.5.0'
  // StateModel.prototype.SAVEFORMAT.serverlink = String; // OPTIONAL alphanumeric serverside identifier

  /**
   * prepares a serializable data object, which can later be used for restoring
   * the current state using the restore() function
   *
   * @returns {Object} a serializable data object, which can be used for restoring
   */
  StateModel.prototype.save = function () {
    var data = StateModel.superclass.save.call(this);

    data.teams = this.teams.save();
    data.teamsize = this.teamsize.get();
    data.tournaments = this.tournaments.save();
    data.serverlink = this.serverlink.get();
    data.options = JSON.parse(Options.toBlob());

    // This reflects the json schema version for now.
    data.version = "1.5.8";

    data.target = Presets.target;

    return data;
  };

  /**
   * restore a previously saved state from a serializable data object
   *
   * @param {Object} data
   *          a data object, that was previously written by save()
   * @returns {boolean} true on success, false otherwise
   */
  StateModel.prototype.restore = function (data) {
    if (!StateModel.superclass.restore.call(this, data)) {
      this.emit("error", "Wrong data format");
      return false;
    }

    if (Presets.target !== data.target) {
      // TODO somehow send a toast
      this.emit("error", "Wrong target: " + data.target + ", expected: " +
        Presets.target);
      return false;
    }

    // TODO perform a version check

    this.clear();

    Options.fromBlob(JSON.stringify(data.options));
    this.teamsize.set(data.teamsize);

    if (!this.teams.restore(data.teams, TeamModel)) {
      this.emit("error", "error: cannot restore State.teams");
      return false;
    }

    if (!this.tournaments.restore(data.tournaments)) {
      this.emit("error", "error: cannot restore State.tournaments");
      return false;
    }

    this.serverlink.set(data.serverlink || undefined);

    return true;
  };

  return StateModel;
});