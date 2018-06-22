define([
  "jquery",
  "lib/extend",
  "core/controller"
], function ($, extend, Controller) {
  function PoulesTournamentController(view) {
    var $mode, $seed, $byepoules, $byeteams, $numpoules, tournament;

    PoulesTournamentController.superconstructor.call(this, view);

    tournament = this.model.tournament;

    $mode = this.view.$mode;
    $seed = this.view.$seed;
    $byepoules = this.view.$byepoules;
    $byeteams = this.view.$byeteams;
    $numpoules = this.view.$numpoulesinput;

    this.$flipbutton = this.view.$view.find("button.flipranking");
    this.$flipbutton.click(function () {
      tournament.flipGroupRankings();
    });

    this.$finalizebutton = this.view.$view.find("button.finalizeranking");
    this.$finalizebutton.click(function () {
      tournament.flipGroupRankings(["poulerank", "pouleid"]);
    });

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

    $byeteams.change(function () {
      tournament.setProperty("poulesbyeteams", $(this).val());
      $byeteams.val($(this).val());
    });

    $numpoules.change(function () {
      tournament.numpoules.set(Number($(this).val()));
    });
  }
  extend(PoulesTournamentController, Controller);

  return PoulesTournamentController;
});