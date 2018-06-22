define(
  ["lib/extend", "core/controller", "ui/state", "ui/toast", "ui/strings"],
  function (extend, Controller, State, Toast, Strings) {
    function PlayerSettingsController(view, teamref) {
      PlayerSettingsController.superconstructor.call(this, view, teamref);

      this.teamref = teamref;

      this.reset = this.reset.bind(this);
      this.update = this.update.bind(this);
      this.enterkey = function (e) {
        if (e.which === 13) {
          this.update();
        }
      }.bind(this);

      this.register();
    }
    extend(PlayerSettingsController, Controller);

    PlayerSettingsController.prototype.register = function () {
      this.view.$view.on("click", "button.reset", this.reset);
      this.view.$view.on("click", "button.update", this.update);
      this.view.$view.on("keypress", "input", this.enterkey);
    };

    PlayerSettingsController.prototype.unregister = function () {
      this.view.$view.off("click", "button.reset", this.reset);
      this.view.$view.off("click", "button.update", this.update);
      this.view.$view.off("keypress", "input", this.enterkey);
    };

    PlayerSettingsController.prototype.reset = function () {
      this.view.update();

      new Toast(Strings.team_settings_reset);
    };

    PlayerSettingsController.prototype.update = function () {
      this.model.firstname = this.view.$view.find(".firstname").val();
      this.model.lastname = this.view.$view.find(".lastname").val();
      this.model.club = this.view.$view.find(".club").val();
      this.model.email = this.view.$view.find(".email").val();
      this.model.license = this.view.$view.find(".license").val();
      this.model.rankingpoints = Number(this.view.$view.find(".rankingpoints").val());
      this.model.elo = Number(this.view.$view.find(".elo").val());

      new Toast(Strings.team_settings_updated);

      if (this.teamref.team) {
        this.teamref.team.updateRankingPointSum();
      }

      this.model.setName(this.view.$view.find(".alias").val());

      this.model.emit("update");
    };

    PlayerSettingsController.prototype.destroy = function () {
      this.unregister();

      PlayerSettingsController.superclass.destroy.call(this);
    };

    return PlayerSettingsController;
  }
);