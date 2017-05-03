/**
 * TournamentRenameController
 *
 * @return TournamentRenameController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/renamecontroller'], function(extend, //
RenameController) {
  /**
   * Constructor
   */
  function TournamentRenameController(view) {
    TournamentRenameController.superconstructor.call(this, view, false);
  }
  extend(TournamentRenameController, RenameController);

  TournamentRenameController.prototype.setName = function(name) {
    if (name) {
      this.model.getName().set(name);
      return true;
    }
    return false;
  };

  TournamentRenameController.prototype.getName = function() {
    return this.model.getName().get();
  };

  return TournamentRenameController;
});
