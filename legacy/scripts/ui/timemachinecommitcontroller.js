/**
 * TimeMachineCommitController
 *
 * @return TimeMachineCommitController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'timemachine/timemachine',
    'ui/stateloader'], function(extend, Controller, TimeMachine, StateLoader) {
  /**
   * Constructor
   */
  function TimeMachineCommitController(view) {
    TimeMachineCommitController.superconstructor.call(this, view);

    this.view.$view.find('button.removecommit').click(this.remove.bind(this));
    this.view.$view.find('button.loaddescendant').click(this.load.bind(this));
    this.view.$view.find('button.cleanuptree').click(this.cleanup.bind(this));
  }
  extend(TimeMachineCommitController, Controller);

  TimeMachineCommitController.prototype.remove = function() {
    this.model.remove();
  };

  TimeMachineCommitController.prototype.cleanup = function() {
    TimeMachine.cleanup(this.model, 0);
  };

  TimeMachineCommitController.prototype.load = function() {
    StateLoader.loadCommit(this.model.getYoungestDescendant() || this.model);
  };

  return TimeMachineCommitController;
});
