import Model from '../core/model.js'
import IndexedListModel from '../list/indexedlistmodel.js'
import ValueModel from '../core/valuemodel.js'
import ListCleanupListener from './listcleanuplistener.js'
import TournamentListModel from '../tournament/tournamentlistmodel.js'
import Options from 'options'
import Presets from 'presets'
import TeamModel from './teammodel.js'

class StateModel extends Model {
  constructor () {
    super()
    // actual state
    this.teams = new IndexedListModel()
    this.teamsize = new ValueModel(Presets.registration.defaultteamsize || Presets.registration.minteamsize)
    this.tournaments = new TournamentListModel()
    this.serverlink = new ValueModel(undefined)

    /*
     * A Supermêlée is chosen when the tournament is created, not
     * when a phase is started: it registers players instead of
     * teams and does not mix with the other systems, so the choice
     * decides which systems the teams tab offers at all.
     * `meleesize` is the size of the drawn line-ups (doublette or
     * triplette), not the registration team size, which is 1.
     */
    this.melee = new ValueModel(false)
    this.meleesize = new ValueModel((Presets.systems.melee && Presets.systems.melee.teamsize) || 2)
    function tabOptionPreset (name, defaultValue) {
      if (!Presets.taboptions || Presets.taboptions[name] === undefined) {
        return new ValueModel(defaultValue)
      }

      // cast to bool, just in case.
      return new ValueModel(!!Presets.taboptions[name])
    }
    this.tabOptions = {
      showNames: tabOptionPreset('shownames', true),
      showTeamName: tabOptionPreset('showteamname', false),
      nameMaxWidth: tabOptionPreset('namemaxwidth', true),
      teamTable: tabOptionPreset('teamtable', true),
      rankingAbbreviations: tabOptionPreset('rankingabbreviations', false),
      showMatchTables: tabOptionPreset('showmatchtables', false),
      hideFinishedGroups: tabOptionPreset('hidefinishedgroups', false)
    }
    this.focusedteam = new ValueModel(undefined) // Holds a TeamModel reference

    this.initCleanupListeners()
  }

  /**
   * whenever an element is removed from those central and elemental lists, call
   * its destroy() function
   *
   * @returns {undefined}
   */
  initCleanupListeners () {
    this.teamscleanuplistener = new ListCleanupListener(this.teams)
    this.tournamentscleanuplistener = new ListCleanupListener(
    //
      this.tournaments)
  }

  /**
   * reset the state of everything
   *
   * @returns {undefined}
   */
  clear () {
    this.tournaments.clear()
    this.teams.clear()
    this.serverlink.set(undefined)
    Options.reset()
    this.emit('clear')

    // explicit rule to avoid uploading an already existing state
    this.teamsize.set(Presets.registration.defaultteamsize || Presets.registration.minteamsize)
    this.melee.set(false)
    this.meleesize.set((Presets.systems.melee && Presets.systems.melee.teamsize) || 2)
  }

  // StateModel.prototype.SAVEFORMAT.serverlink = String; // OPTIONAL alphanumeric serverside identifier

  /**
   * prepares a serializable data object, which can later be used for restoring
   * the current state using the restore() function
   *
   * @returns {Object} a serializable data object, which can be used for restoring
   */
  save () {
    const data = super.save()
    data.teams = this.teams.save()
    data.teamsize = this.teamsize.get()
    data.tournaments = this.tournaments.save()
    data.serverlink = this.serverlink.get()
    data.options = JSON.parse(Options.toBlob())

    // deliberately not in SAVEFORMAT: a state written before the
    // Supermêlée existed has to keep restoring, and a state written
    // now has to keep loading in an older build
    data.melee = this.melee.get()
    data.meleesize = this.meleesize.get()

    // This reflects the json schema version for now.
    data.version = '1.5.26'
    data.target = Presets.target
    return data
  }

  /**
   * restore a previously saved state from a serializable data object
   *
   * @param {Object} data
   *          a data object, that was previously written by save()
   * @returns {boolean} true on success, false otherwise
   */
  restore (data) {
    if (!super.restore(data)) {
      this.emit('error', 'Wrong data format')
      return false
    }
    if (Presets.target !== data.target) {
      // TODO somehow send a toast
      this.emit('error', 'Wrong target: ' + data.target + ', expected: ' + Presets.target)
      return false
    }

    // TODO perform a version check

    this.clear()
    Options.fromBlob(JSON.stringify(data.options))
    this.teamsize.set(data.teamsize)
    if (!this.teams.restore(data.teams, TeamModel)) {
      this.emit('error', 'error: cannot restore State.teams')
      return false
    }
    if (!this.tournaments.restore(data.tournaments)) {
      this.emit('error', 'error: cannot restore State.tournaments')
      return false
    }
    this.serverlink.set(data.serverlink || undefined)
    this.melee.set(!!data.melee)
    this.meleesize.set(data.meleesize || this.meleesize.get())
    return true
  }
}

StateModel.prototype.EVENTS = {
  error: true,
  clear: true
}

StateModel.prototype.SAVEFORMAT = Object.create(Model.prototype.SAVEFORMAT)
StateModel.prototype.SAVEFORMAT.options = Object
StateModel.prototype.SAVEFORMAT.teams = [Object]
StateModel.prototype.SAVEFORMAT.teamsize = Number
StateModel.prototype.SAVEFORMAT.tournaments = Object
StateModel.prototype.SAVEFORMAT.target = String // e.g. 'tac', 'boule', ...
StateModel.prototype.SAVEFORMAT.version = String // e.g. '1.5.0'
export default StateModel
