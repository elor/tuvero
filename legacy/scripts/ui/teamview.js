/**
 * A teamView, which sets the .teamno and .name elements of the associated DOM
 * element
 *
 * @return TeamView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/view'], function(extend, View) {

  /**
   * Constructor
   *
   * @param model
   *          a TeamModel instance
   * @param $view
   *          the associated DOM element
   */
  function TeamView(model, $view) {
    TeamView.superconstructor.call(this, model, $view);

    this.update();
  }
  extend(TeamView, View);

  /**
   * write the playernames and teamnumber to the DOM
   */
  TeamView.prototype.update = function() {
    var $names, i, $name, $teamno, player;

    $teamno = this.$view.find('.teamno');
    if ($teamno.length === 0) {
      $teamno = this.$view.filter('.teamno');
    }
    $teamno.text(this.model.getID() + 1);

    $names = this.$view.find('.name');
    if ($names.length === 0) {
      $names = this.$view.filter('.name');
    }

    // FIXME read maxteamsize from options or something
    for (i = 0; i < 3; i += 1) {
      $name = $names.eq(i);
      player = this.model.getPlayer(i);

      if (player) {
        $name.text(player.getName());
      } else {
        $name.remove();
      }
    }
  };

  /**
   * Callback listener
   */
  TeamView.prototype.onupdate = function() {
    this.update();
  };

  TeamView.bindTeamList = function(teamlist) {
    function IndexTeamView(teamID, $view) {
      IndexTeamView.superconstructor.call(this, teamlist.get(teamID), $view);
    }
    extend(IndexTeamView, TeamView);

    return IndexTeamView;
  };

  return TeamView;
});
