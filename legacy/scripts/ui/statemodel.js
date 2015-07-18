/**
 * A class for collecting all necessary state information of one or more running
 * tournaments.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/listmodel', 'core/indexedlistmodel',
    'core/valuemodel', './listcleanuplistener', 'core/tournamentlistmodel'],//
function(extend, Model, ListModel, IndexedListModel, ValueModel,
    ListCleanupListener, TournamentListModel) {

  /**
   * Constructor
   */
  function StateModel() {
    this.teams = new IndexedListModel();
    this.teamscleanuplistener = new ListCleanupListener(this.teams);
    this.teamsize = new ValueModel(3);
    this.tournaments = new TournamentListModel();
  }
  extend(StateModel, Model);

  StateModel.prototype.SAVEFORMAT = Object
      .create(StateModel.superclass.SAVEFORMAT);
  StateModel.prototype.SAVEFORMAT.teams = [Object];
  StateModel.prototype.SAVEFORMAT.teamsize = Number;
  StateModel.prototype.SAVEFORMAT.tournaments = [Object];
  StateModel.prototype.SAVEFORMAT.version = String;

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

    this.tournaments.clear();
    this.teams.clear();

    this.teamsize.set(data.teamsize);
    this.teams.restore(data.teams);
    this.tournaments.clear(data.tournaments);
  }

  return StateModel;
});
