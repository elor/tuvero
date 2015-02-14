/**
 * TeamTableView
 *
 * TODO extract the teamsize logic to a ClassView+IsEmptyModel (or something)
 *
 * TODO make this a general TableView, which inherits from ListView and hides as
 * soon as the list is empty
 *
 * @return TeamTableView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './view'], function(extend, View) {
  /**
   * Constructor
   *
   * @param teamview
   *          a ListView of the table
   * @param teamsize
   *          a ValueModel instance of the team size
   */
  function TeamTableView(teamview, teamsize) {
    TeamTableView.superconstructor.call(this, teamsize, teamview.$view);

    this.teamlist = teamview.model;
    this.teamlist.registerListener(this);

    this.$names = this.$view.find('tr>th.playercol');

    this.updateVisibility();
    this.updatePlayerColumns();
  }
  extend(TeamTableView, View);

  /**
   * show one column for each player in a team (teamsize)
   */
  TeamTableView.prototype.updatePlayerColumns = function() {
    var teamsize;

    teamsize = this.model.get();

    this.$names.each(function(index, elem) {
      var $elem;

      $elem = $(elem);

      if (index < teamsize) {
        $elem.removeClass('hidden');
      } else {
        $elem.addClass('hidden');
      }
    });
  };

  /**
   * hide the whole table if there's no player; show it as soon as a player has
   * been registered
   */
  TeamTableView.prototype.updateVisibility = function() {
    if (this.teamlist.length === 0) {
      this.$view.addClass('hidden');
    } else {
      this.$view.removeClass('hidden');
    }
  };

  /**
   * the team size changed. check player column visibility
   */
  TeamTableView.prototype.onupdate = function() {
    this.updatePlayerColumns();
  };

  /**
   * the number of teams changed. update the visibility
   */
  TeamTableView.prototype.onresize = function() {
    this.updateVisibility();
  };

  return TeamTableView;
});
