define(
  ['lib/extend', 'core/controller', 'ui/state', 'ui/toast', 'ui/strings'],
  function (extend, Controller, State, Toast, Strings) {
    function TeamSettingsController (view) {
      TeamSettingsController.superconstructor.call(this, view)

      this.reset = this.reset.bind(this)
      this.update = this.update.bind(this)
      this.enterkey = function (e) {
        if (e.which === 13) {
          this.update()
        }
      }.bind(this)

      this.register()
    }
    extend(TeamSettingsController, Controller)

    TeamSettingsController.prototype.register = function () {
      this.view.$view.on('click', 'button.reset', this.reset)
      this.view.$view.on('click', 'button.update', this.update)
      this.view.$view.on('keypress', 'input', this.enterkey)
    }

    TeamSettingsController.prototype.unregister = function () {
      this.view.$view.off('click', 'button.reset', this.reset)
      this.view.$view.off('click', 'button.update', this.update)
      this.view.$view.off('keypress', 'input', this.enterkey)
    }

    TeamSettingsController.prototype.reset = function () {
      this.view.update()

      Toast.once(Strings.team_settings_reset)
    }

    TeamSettingsController.prototype.update = function () {
      this.model.number = this.view.$view.find('.teamnumber').val()
      this.model.alias = this.view.$view.find('.alias').val()
      this.model.club = this.view.$view.find('.club').val()
      this.model.rankingpoints = Number(this.view.$view.find('.rankingpoints').val())
      this.model.elo = Number(this.view.$view.find('.elo').val())

      Toast.once(Strings.team_settings_updated)

      this.model.emit('update')
    }

    TeamSettingsController.prototype.destroy = function () {
      this.unregister()

      TeamSettingsController.superclass.destroy.call(this)
    }

    return TeamSettingsController
  }
)
