/**
 * StateLoader: A singleton for loading save states
 *
 * @return StateLoaderModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['semver', 'ui/state', 'timemachine/timemachine',
  'ui/legacyloadermodel', 'ui/legacystoragekeyconverter',
  'ui/teamsfileloadcontroller'
],
function (semver, State, TimeMachine, LegacyLoaderModel, LegacyStorageKeyConverter,
  TeamsFileLoadController) {
  var StateLoader, versionFixers

  versionFixers = {
    '1.5.25': function (data) {
      data.tournaments.tournaments.forEach(function (tournament) {
        if (!tournament.totalvotes) {
          tournament.totalvotes = tournament.votes
        }
      })
    },
    '1.5.26': function (data) {
      data.tournaments.tournaments.forEach(function (tournament) {
        tournament.matches.forEach(function (match) {
          if (!match.place) {
            match.place = ''
          }
        })
        tournament.history.forEach(function (match) {
          if (!match.place) {
            match.place = ''
          }
        })
      })
    }
  }

  /**
     * Constructor. Also auto-converts all legacy storage keys. This will only be
     * performed once every pageload StateLoader this is a singleton.
     *
     * @returns {StateLoaderModel} instance
     */
  function StateLoaderModel () {
    var converter = new LegacyStorageKeyConverter()
    converter.convertAll()
  }

  /**
     * find the latest commit and load it.
     *
     * @returns {boolean} true on success, false otherwise
     */
  StateLoaderModel.prototype.loadLatest = function () {
    var lastCommit

    if (TimeMachine.roots.length === 0) {
      return false
    }

    lastCommit = TimeMachine.roots.get(TimeMachine.roots.length - 1)
    lastCommit = lastCommit.getYoungestDescendant() || lastCommit

    return this.loadCommit(lastCommit)
  }

  /**
     * load the state from an existing commit
     *
     * @param {string} commit
     *          a valid commit to load.
     * @returns {boolean} true on success, false otherwise
     */
  StateLoaderModel.prototype.loadCommit = function (commit) {
    var string

    if (!commit || !commit.isValid()) {
      return false
    }

    string = TimeMachine.load(commit)

    if (!string) {
      return false
    }

    return this.loadString(string)
  }

  /**
     * load the state from a string (serialized data)
     *
     * @param {string} string
     *          the serialized data
     * @return {boolean} true on success, false otherwise
     */
  StateLoaderModel.prototype.loadString = function (string) {
    var data

    if (!string) {
      return false
    }

    try {
      data = JSON.parse(string)
    } catch (e) {
      // try CSV-loading
      return this.loadTeamsCSV(string)
    }

    return this.loadData(data)
  }

  /**
     * load the state from a save-data object. Tries to up-convert old savestates
     *
     * @param {Object} data
     *          the save-data object, as written by State.save() at some point in
     *          the past
     * @returns {boolean} true on success, false otherwise.
     */
  StateLoaderModel.prototype.loadData = function (data) {
    var success

    if (!data) {
      return false
    }

    if (!data.version) {
      // pre-1.5.0
      return this.loadLegacyData(data)
    }

    this.fixVersions(data)

    success = State.restore(data)

    if (success) {
      console.log('savestate loaded')
    }

    return success
  }

  /**
     * load an old save state, from pre-1.5.0 times when the MVC-classes weren't
     * completed yet
     *
     * @param {Object} data
     *          a data object of pre-1.5.0 format
     * @return {boolean} true on success, false otherwise
     */
  StateLoaderModel.prototype.loadLegacyData = function (data) {
    var loader

    console.warn('Saved data is older than 1.5.0. ' +
        'Tuvero tries to auto-convert it, but success is not guaranteed.' +
        'Please check the results before trusting them blindly')

    loader = new LegacyLoaderModel()
    try {
      if (loader.load(data)) {
        console.log('legacy savestate loaded')
        return true
      }
    } catch (e) {
      console.error(e.stack)
    }

    return false
  }

  StateLoaderModel.prototype.fixVersions = function (data) {
    var versions = Object.keys(versionFixers)
      .filter(function (version) {
        return semver.lt(data.version, version)
      })
      .sort(semver.compare)

    versions.forEach(function (version) {
      console.log('updating json data to version ' + version)
      versionFixers[version](data)
    })
  }

  StateLoaderModel.prototype.loadTeamsCSV = function (csvString) {
    try {
      State.clear()
      return TeamsFileLoadController.load(csvString)
    } catch (e) {}
    return false
  }

  /**
     * reset the current state and forget about all previously loaded states
     *
     * @returns {undefined}
     */
  StateLoaderModel.prototype.unload = function () {
    TimeMachine.unload()
    State.clear()
  }

  /*
     * StateLoader is a singleton
     */
  StateLoader = new StateLoaderModel()

  return StateLoader
})
