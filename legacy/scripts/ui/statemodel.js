/**
 * A class for collecting all necessary state information of one or more running
 * tournaments.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/listmodel', 'core/indexedlistmodel',
    'core/valuemodel', './listcleanuplistener', 'core/tournamentlistmodel',
    'options', './teammodel'], function(extend, Model, ListModel,
    IndexedListModel, ValueModel, ListCleanupListener, TournamentListModel,
    Options, TeamModel) {

  /**
   * Constructor
   */
  function StateModel() {
    // actual state
    this.teams = new IndexedListModel();
    this.teamsize = new ValueModel(3);
    this.tournaments = new TournamentListModel();

    this.initCleanupListeners();
  }
  extend(StateModel, Model);

  /**
   * whenever an element is removed from those central and elemental lists, call
   * its destroy() function
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
    // this.teamsize.set(3); // TODO read default team size from options
  };

  StateModel.prototype.SAVEFORMAT = Object
      .create(StateModel.superclass.SAVEFORMAT);
  StateModel.prototype.SAVEFORMAT.teams = [Object];
  StateModel.prototype.SAVEFORMAT.teamsize = Number;
  StateModel.prototype.SAVEFORMAT.tournaments = [Object];
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

    // TODO read from DOM or something
    data.version = '1.5.0-dev';

    // TODO read from DOM or something
    data.target = Options.target;

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
      return false;
    }

    // TODO perform a version check

    this.clear();

    this.teamsize.set(data.teamsize);
    this.teams.restore(data.teams, TeamModel);
    this.tournaments.restore(data.tournaments);

    return true;
  };

  return StateModel;
});
