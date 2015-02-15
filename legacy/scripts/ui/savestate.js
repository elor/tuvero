/**
 * Save states
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/listener', './state_new', './storage'], function(
    extend, Listener, State, Storage) {

  function SaveState(emitter) {
    SaveState.superconstructor.call(this, emitter);
  }
  extend(SaveState, Listener);

  SaveState.prototype.save = function() {
    Storage.store();
  };

  SaveState.prototype.oninsert = function() {
    this.save();
  };

  SaveState.prototype.onremove = function() {
    this.save();
  };

  SaveState.prototype.onreset = function() {
    this.save();
  };

  State.saveStates = {};

  // FIXME move this to the storage file, or associate it somehow otherwise
  // TODO StateModel could remap all events to its own emitter, which then
  // triggers the save function.
  State.saveStates.teams = new SaveState(State.teams);

  return SaveState;
});
