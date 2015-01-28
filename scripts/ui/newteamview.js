/**
 * Represents a form with input elements and submit method, with which a new
 * team is to be added to the associated ListModel
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ 'lib/extend', './interfaces/view', './newteamcontroller' ], function (
    extend, View, NewTeamController) {
  /**
   * Constructor
   * 
   * @param model
   *          a ListModel for containing the teams
   * @param $view
   *          a form which contains two input elements and a submit button
   */
  function NewTeamView (model, $view) {
    NewTeamView.superconstructor.call(this, model, $view);

    this.$players = $view.find('input.playername');

    new NewTeamController(this);
  }
  extend(NewTeamView, View);

  /**
   * clear the name input fields
   */
  NewTeamView.prototype.resetNames = function () {
    this.$players.val('');
  };

  /**
   * focus the first empty or whitespace-only name input field
   */
  NewTeamView.prototype.focusEmpty = function () {
    this.$players.each(function () {
      if (/^\s*$/.test($(this).val())) {
        $(this).focus();
        return false;
      }
    });
  };

  /**
   * Callback function, after resetting the teams
   * 
   * Note to self: the 'reset' event is fired by the model, which is a ListView
   * containing the teams. Do not fire 'reset' on this model manually!
   */
  NewTeamView.prototype.onreset = function () {
    this.resetNames();
  };

  return NewTeamView;
});
