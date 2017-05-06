/**
 * A class for collecting all necessary state information of one or more running
 * tournaments.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/indexedlistmodel', 'core/valuemodel',
    './listcleanuplistener', 'core/tournamentlistmodel', 'options', 'presets',
    './teammodel', 'core/listener'], function(extend, Model, IndexedListModel,
    ValueModel, ListCleanupListener, TournamentListModel, Options, Presets,
    TeamModel, Listener) {

  /**
   * Constructor
   */
  function StateModel() {
    StateModel.superconstructor.call(this);
    // actual state
    this.teams = new IndexedListModel();
    this.teamsize = new ValueModel(3);
    this.tournaments = new TournamentListModel();

    function tabOptionPreset(name, defaultValue) {
      if (!Presets.taboptions || Presets.taboptions[name] === undefined) {
        return new ValueModel(defaultValue);
      }

      // cast to bool, just in case.
      return new ValueModel(!!Presets.taboptions[name]);
    }

    this.tabOptions = {
      showNames: tabOptionPreset('shownames', true),
      nameMaxWidth: tabOptionPreset('namemaxwidth', true),
      teamTable: tabOptionPreset('teamtable', true),
      rankingAbbreviations: tabOptionPreset('rankingabbreviations', false),
      showMatchTables: tabOptionPreset('showmatchtables', false),
      hideFinishedGroups: tabOptionPreset('hidefinishedgroups', false)
    };

    this.initCleanupListeners();

    Listener.bind(this, 'error', function(emitter, event, message) {
      console.error(message);
    });
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
   * TODO inline State.initCleanupListeners!
   */
  StateModel.prototype.initCleanupListeners = function() {
    this.teamscleanuplistener = new ListCleanupListener(this.teams);
    this.tournamentscleanuplistener = new ListCleanupListener(//
    this.tournaments);
  };

  /**
   * reset the state of everything
   */
  StateModel.prototype.clear = function() {
    this.tournaments.clear();
    this.teams.clear();
    Options.reset();
    this.emit('clear');
    // this.teamsize.set(3); // TODO read default team size from options
  };

  StateModel.prototype.SAVEFORMAT = Object
      .create(StateModel.superclass.SAVEFORMAT);
  StateModel.prototype.SAVEFORMAT.options = Object;
  StateModel.prototype.SAVEFORMAT.teams = [Object];
  StateModel.prototype.SAVEFORMAT.teamsize = Number;
  StateModel.prototype.SAVEFORMAT.tournaments = Object;
  StateModel.prototype.SAVEFORMAT.target = String; // e.g. 'tac', 'boule', ...
  StateModel.prototype.SAVEFORMAT.version = String; // e.g. '1.5.0'

  /**
   * prepares a serializable data object, which can later be used for restoring
   * the current state using the restore() function
   *
   * @return a serializable data object, which can be used for restoring
   */
  StateModel.prototype.save = function() {
    var data = StateModel.superclass.save.call(this);

    data.teams = this.teams.save();
    data.teamsize = this.teamsize.get();
    data.tournaments = this.tournaments.save();
    data.options = JSON.parse(Options.toBlob());

    // TODO read from DOM or something
    data.version = '1.5.0-dev';

    // TODO read from DOM or something
    data.target = Presets.target;

    return data;
  };

  /**
   * restore a previously saved state from a serializable data object
   *
   * @param data
   *          a data object, that was previously written by save()
   * @return true on success, false otherwise
   */
  StateModel.prototype.restore = function(data) {
    if (!StateModel.superclass.restore.call(this, data)) {
      this.emit('Wrong data format');
      return false;
    }

    if (Presets.target !== data.target) {
      // TODO somehow send a toast
      this.emit('error', 'Wrong target: ' + data.target + ', expected: '
          + Presets.target);
      return false;
    }

    // TODO perform a version check

    this.clear();

    Options.fromBlob(JSON.stringify(data.options));
    this.teamsize.set(data.teamsize);

    if (!this.teams.restore(data.teams, TeamModel)) {
      this.emit('error', 'error: cannot restore State.teams');
      return false;
    }

    if (!this.tournaments.restore(data.tournaments)) {
      this.emit('error', 'error: cannot restore State.tournaments');
      return false;
    }

    return true;
  };

  return StateModel;
});