define(['lib/extend', 'core/controller', 'ui/state', 'ui/strings'], function (
  extend, Controller, State, Strings) {
  function DeleteAllTeamsController (view) {
    DeleteAllTeamsController.superconstructor.call(this, view)

    this.view.$view.click(this.confirmDeletion.bind(this))
  }
  extend(DeleteAllTeamsController, Controller)

  DeleteAllTeamsController.prototype.confirmDeletion = function () {
    if (this.model.get()) {
      console.error('cannot delete all teams: registration is already closed')
      return
    }

    if (window.confirm(Strings.deleteallteamsconfirmation)) {
      this.performDeletion()
    }
  }

  DeleteAllTeamsController.prototype.performDeletion = function () {
    State.teams.clear()
  }

  return DeleteAllTeamsController
})
