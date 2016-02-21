/**
 * StateSaver: Properly saves the State to the TimeMachine
 *
 * @return StateSaver
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/state', 'timemachine/timemachine', 'ui/stateloader'], function(
    State, TimeMachine, StateLoader) {
  var StateSaver;

  /**
   * Constructor of the singleton StateSaver
   */
  function StateSaverModel() {
    this.createTree = undefined;
  }

  StateSaverModel.prototype.newTree = function(name) {
    this.createTree = name || '';
  };

  StateSaverModel.prototype.createNewEmptyTree = function(name) {
    this.newTree(name);

    State.clear();

    return this.saveState();
  };

  /**
   * Save the current state to a new commit
   *
   * @return true on success, false otherwise
   */
  StateSaverModel.prototype.saveState = function() {
    var data = State.save();

    return this.saveData(data);
  };

  /**
   * Save a data object to a new commit
   *
   * @param data
   *          a data object to save
   * @return true on success, false otherwise
   */
  StateSaverModel.prototype.saveData = function(data) {
    var string;

    if (!data) {
      return false;
    }

    string = JSON.stringify(data);

    return this.saveString(string);
  };

  /**
   * Save a string to a new commit
   *
   * @param string
   *          the string to store
   * @return true on success, false otherwise
   */
  StateSaverModel.prototype.saveString = function(string) {
    var commit, success;

    if (!string) {
      return false;
    }

    if (this.createTree === undefined) {
      commit = TimeMachine.save(string);
    } else {
      commit = TimeMachine.init(string, this.createTree);
    }

    if (!commit) {
      return false;
    }

    success = commit.isValid();

    if (success) {
      this.createTree = undefined;
      // TODO auto-adjust the number of stored commits.
      TimeMachine.cleanup(commit, 3);
      console.log('state saved');
    }

    return success;
  };

  StateSaverModel.prototype.removeEverything = function() {
    StateLoader.unload();
    while (TimeMachine.roots.length > 0) {
      TimeMachine.roots.get(0).eraseTree();
    }
    TimeMachine.getOrphans().forEach(function(orphan) {
      orphan.remove();
    });
  };

  /*
   * StateSaver is a singleton
   */
  StateSaver = new StateSaverModel();

  return StateSaver;
});