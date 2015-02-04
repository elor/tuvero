/**
 * TeamTableView
 *
 * @return TeamTableView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './view'], function(extend, View) {
  /**
   * Constructor
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
   *
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
   *
   */
  TeamTableView.prototype.updateVisibility = function() {
    if (this.teamlist.length === 0) {
      this.$view.addClass('hidden');
    } else {
      this.$view.removeClass('hidden');
    }
  };

  /**
   *
   */
  TeamTableView.prototype.onupdate = function() {
    this.updatePlayerColumns();
  };

  /**
   *
   */
  TeamTableView.prototype.onresize = function() {
    this.updateVisibility();
  };

  return TeamTableView;
});
