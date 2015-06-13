/**
 * MatchView
 *
 * @return MatchView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/teamview'], function(extend, View,
    TeamView) {
  /**
   * Constructor
   *
   * @param model
   *          a RankingModel instance
   * @param $view
   *          a jQuery object representing a MatchView table
   */
  function MatchView(model, $view) {
    MatchView.superconstructor.call(this, model, $view);

    this.teamviews = [];

    this.update();
  }
  extend(MatchView, View);

  /**
   * destroy all team views before creating new ones on the existing items. This
   * is a bit too much, but it shouldn't be called too often, right?
   */
  MatchView.prototype.destroyTeamViews = function() {
    // destroy all teamviews in order to create new ones
    this.teamviews.forEach(function(teamview) {
      teamview.destroy();
    });
    this.teamviews.splice(0);
  };

  /**
   * update all the values
   */
  MatchView.prototype.update = function() {
    var $teams, i, $team, teamid;

    $teams = this.$view.find('.team');

    this.destroyTeamViews();

    // FIXME support for a varying number of teams required
    for (i = 0; i < $teams.length; i += 1) {
      $team = $teams.eq(i);
      teamid = this.model.getTeamID(i);

      if (teamid !== undefined && this.teamList) {
        this.teamviews.push(new TeamView(this.teamList.get(), $team));
      } else {
        $team.text(teamid);
      }
    }
  };

  /**
   * Callback Listener. For safety. Is never called in the current
   * implementation.
   *
   * @param emitter
   *          this.model
   * @param event
   *          'update'
   * @param data
   *          should be undefined
   */
  MatchView.prototype.onupdate = function(emitter, event, data) {
    this.update();
  };

  /**
   * bind a whole MatchView subclass to a list of teams for better display.
   *
   * @param teamList
   *          a ListModel of TeamModel instances
   * @return a new MatchView constructor, which has this.teamList set
   */
  MatchView.bindTeamList = function(teamList) {
    function MyMatchView() {
      MyMatchView.superconstructor.apply(this, arguments);
    }
    extend(MatchView, View);

    MyMatchView.prototype.teamlist = teamList;

    return MyMatchView;
  };

  return MatchView;
});
