define([
  "jquery",
  "lib/extend",
  "core/controller"
], function ($, extend, Controller) {
  function PoulesTournamentController(view) {
    var $mode, $seed, tournament;

    PoulesTournamentController.superconstructor.call(this, view);

    tournament = this.model.tournament;

    this.$options = this.view.$view.find(".tournamentoptions");
    $mode = this.$options.find("select.mode");
    $seed = this.$options.find("select.seed");

    $mode.change(function () {
      tournament.setProperty("poulesmode", $(this).val());
      $mode.val($(this).val());
    });

    $seed.change(function () {
      tournament.setProperty("poulesseed", $(this).val());
      $seed.val($(this).val());
    });
  }
  extend(PoulesTournamentController, Controller);

  return PoulesTournamentController;
});