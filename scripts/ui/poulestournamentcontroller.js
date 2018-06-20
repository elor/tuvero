define([
  "jquery",
  "lib/extend",
  "core/controller"
], function ($, extend, Controller) {
  function PoulesTournamentController(view) {
    var $mode, $seed, $byepoules, $numpoules, tournament;

    PoulesTournamentController.superconstructor.call(this, view);

    tournament = this.model.tournament;

    $mode = this.view.$mode;
    $seed = this.view.$seed;
    $byepoules = this.view.$byepoules;
    $numpoules = this.view.$numpoulesinput;

    $mode.change(function () {
      tournament.setProperty("poulesmode", $(this).val());
      $mode.val($(this).val());
    });

    $seed.change(function () {
      tournament.setProperty("poulesseed", $(this).val());
      $seed.val($(this).val());
    });

    $byepoules.change(function () {
      tournament.setProperty("poulesbyepoules", $(this).val());
      $byepoules.val($(this).val());
    });

    $numpoules.change(function () {
      tournament.numpoules.set(Number($(this).val()));
    });
  }
  extend(PoulesTournamentController, Controller);

  return PoulesTournamentController;
});