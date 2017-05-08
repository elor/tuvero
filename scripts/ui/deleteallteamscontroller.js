/**
 * DeleteAllTeamsController
 *
 * @return DeleteAllTeamsController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'ui/state', 'ui/strings'], function(
    extend, Controller, State, Strings) {
  /**
   * Constructor
   */
  function DeleteAllTeamsController(view) {
    DeleteAllTeamsController.superconstructor.call(this, view);

    this.view.$view.click(this.confirmDeletion.bind(this));
  }
  extend(DeleteAllTeamsController, Controller);

  /**
   * ask the user if he really wants to delete all teams. abortf if not.
   */
  DeleteAllTeamsController.prototype.confirmDeletion = function() {
    if (State.tournaments.length !== 0) {
      console.error('cannot delete all teams: there are tournaments');
    }

    if (window.confirm(Strings.deleteallteamsconfirmation)) {
      this.performDeletion();
    }
  };

  /**
   * really REALLY delete all registered teams
   */
  DeleteAllTeamsController.prototype.performDeletion = function() {
    State.teams.clear();
  };

  return DeleteAllTeamsController;
});
