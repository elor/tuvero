define(["lib/extend", "ui/tournamentview", "ui/poulestournamentcontroller"],
  function (extend, TournamentView, PoulesTournamentController) {
    function PoulesTournamentView(model, $view, tournaments) {
      PoulesTournamentView.superconstructor.call(this, model, $view, tournaments);
      this.tournament = this.model.tournament;

      this.$mode = this.$view.find(".tournamentoptions .option select.mode");
      this.$mode.val(this.tournament.getProperty("poulesmode"));

      this.$seed = this.$view.find(".tournamentoptions .option select.seed");
      this.$seed.val(this.tournament.getProperty("poulesseed"));

      this.$numpoulesinput = this.$view.find("input.numpoules");
      this.$numbyepoulestext = this.$view.find(".numbyepoules");

      this.tournament.numpoules.registerListener(this);
      this.tournament.numbyepoules.registerListener(this);
      this.updateNumPoules();

      this.subcontroller = new PoulesTournamentController(this);
    }
    extend(PoulesTournamentView, TournamentView);

    PoulesTournamentView.prototype.updateNumPoules = function () {
      this.$numpoulesinput.prop("min", this.tournament.minPoules());
      this.$numpoulesinput.prop("max", this.tournament.maxPoules());
      this.$numpoulesinput.val(this.tournament.numpoules.get());
      this.$numpoulesinput.prop("disabled", this.tournament.minPoules() === this.tournament.maxPoules());

      this.$numbyepoulestext.text(this.tournament.numbyepoules.get());
    };

    PoulesTournamentView.prototype.onupdate = function () {
      this.updateNumPoules();
    };

    return PoulesTournamentView;
  });