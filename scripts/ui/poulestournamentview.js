define(["lib/extend", "ui/tournamentview", "ui/poulestournamentcontroller"],
  function (extend, TournamentView, PoulesTournamentController) {
    function PoulesTournamentView(model, $view, tournaments) {
      PoulesTournamentView.superconstructor.call(this, model, $view, tournaments);

      this.$view.find(".tournamentoptions .option select.mode").val(
        this.model.tournament.getProperty("poulesmode"));

      this.$view.find(".tournamentoptions .option select.seed").val(
        this.model.tournament.getProperty("poulesseed"));

      this.subcontroller = new PoulesTournamentController(this);
    }
    extend(PoulesTournamentView, TournamentView);

    return PoulesTournamentView;
  });