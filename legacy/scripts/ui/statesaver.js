/**
 * StateSaver: Properly saves the State to the TimeMachine
 *
 * @return StateSaver
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/state_new', 'timemachine/timemachine'], function(State, //
TimeMachine) {
  var StateSaver;

  /**
   * Constructor of the singleton StateSaver
   */
  function StateSaverModel() {
  }

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

    commit = TimeMachine.save(string);
    if (!commit) {
      return false;
    }

    success = commit.isValid();

    if (success) {
      // TODO auto-adjust the number of stored commits.
      TimeMachine.cleanup(commit, 3);
      console.log('state saved');
    }

    return success;
  };

  /*
   * StateSaver is a singleton
   */
  StateSaver = new StateSaverModel();

  return StateSaver;
});