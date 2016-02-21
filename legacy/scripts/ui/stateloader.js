/**
 * StateLoader: A singleton for loading save states
 *
 * @return StateLoaderModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/state', 'timemachine/timemachine', 'ui/legacyloadermodel',
    'ui/legacystoragekeyconverter'], function(State, TimeMachine,
    LegacyLoaderModel, LegacyStorageKeyConverter) {
  var StateLoader;

  /**
   * Constructor. Also auto-converts all legacy storage keys. This will only be
   * performed once every pageload StateLoader this is a singleton.
   */
  function StateLoaderModel() {
    var converter = new LegacyStorageKeyConverter();
    converter.convertAll();
  }

  /**
   * find the latest commit and load it.
   *
   * @return true on success, false otherwise
   */
  StateLoaderModel.prototype.loadLatest = function() {
    var lastCommit;

    if (TimeMachine.roots.length === 0) {
      return false;
    }

    lastCommit = TimeMachine.roots.get(TimeMachine.roots.length - 1);
    lastCommit = lastCommit.getYoungestDescendant() || lastCommit;

    return this.loadCommit(lastCommit);
  };

  /**
   * load the state from an existing commit
   *
   * @param commit
   *          a valid commit to load.
   * @return true on success, false otherwise
   */
  StateLoaderModel.prototype.loadCommit = function(commit) {
    var string;

    if (!commit || !commit.isValid()) {
      return false;
    }

    string = TimeMachine.load(commit);

    if (!string) {
      return false;
    }

    return this.loadString(string);
  };

  /**
   * load the state from a string (serialized data)
   *
   * @param string
   *          the serialized data
   * @return true on success, false otherwise
   */
  StateLoaderModel.prototype.loadString = function(string) {
    var data;

    if (!string) {
      return false;
    }

    try {
      data = JSON.parse(string);
    } catch (e) {
      return false;
    }

    return this.loadData(data);
  };

  /**
   * load the state from a save-data object. Tries to up-convert old savestates
   *
   * @param data
   *          the save-data object, as written by State.save() at some point in
   *          the past
   * @return true on success, false otherwise.
   */
  StateLoaderModel.prototype.loadData = function(data) {
    var success;

    if (!data) {
      return false;
    }

    if (!data.version) {
      // pre-1.5.0
      return this.loadLegacyData(data);
    }

    success = State.restore(data);

    if (success) {
      console.log('savestate loaded');
    }

    return success;
  };

  /**
   * load an old save state, from pre-1.5.0 times when the MVC-classes weren't
   * completed yet
   *
   * @param data
   *          a data object of pre-1.5.0 format
   * @return true on success, false otherwise
   */
  StateLoaderModel.prototype.loadLegacyData = function(data) {
    console.warn('Saved data is older than 1.5.0. '
        + 'Tuvero tries to auto-convert it, but success is not guaranteed.'
        + 'Please check the results before trusting them blindly');

    loader = new LegacyLoaderModel();
    try {
      if (loader.load(data)) {
        console.log('legacy savestate loaded');
        return true;
      }
    } catch (e) {
      console.error(e.stack);
    }

    return false;
  };

  /**
   * reset the current state and forget about all previously loaded states
   */
  StateLoaderModel.prototype.unload = function() {
    TimeMachine.unload();
    State.clear();
  };

  /*
   * StateLoader is a singleton
   */
  StateLoader = new StateLoaderModel();

  return StateLoader;
});
