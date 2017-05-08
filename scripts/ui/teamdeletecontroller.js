/**
 * TeamDeleteController
 *
 * @return TeamDeleteController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'ui/state', 'ui/strings'], function (
    extend, Controller, State, Strings) {
    /**
     * Constructor
     */
    function TeamDeleteController(view) {
        TeamDeleteController.superconstructor.call(this, view);

        this.view.$view.find('button.delete').click(this.confirmDeletion.bind(this));
    }
    extend(TeamDeleteController, Controller);

    /**
     * ask the user if he really wants to delete all teams. abort if not.
     */
    TeamDeleteController.prototype.confirmDeletion = function () {
        var id = this.model.getID();
        if (id === -1) {
            console.error('Cannot delete team: It has not been assigned to a list, hence its ID is -1');
        } else if (State.teams.get(id) !== this.model) {
            console.error('Cannot delete team: ID mismatch. Has the team already been removed from the list?');
        } else if (window.confirm(Strings.deleteteamconfirmation.replace('%1', this.model.getID() + 1).replace('%2', this.model.getNames().join('/')))) {
            this.performDeletion();
        }
    };

    /**
     * really REALLY delete all registered teams
     */
    TeamDeleteController.prototype.performDeletion = function () {
        var id = this.model.getID();
        if (id === -1) {
            console.error('Cannot delete team: It has not been assigned to a list, hence its ID is -1');
        } else if (State.teams.get(id) !== this.model) {
            console.error('Cannot delete team: ID mismatch. Has the team already been removed from the list?');
        } else {
            State.teams.remove(id);
        }
    };

    return TeamDeleteController;
});
