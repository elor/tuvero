/**
 * TeamTableView: hides th.playercol tags in consecutive occurrences, when their
 * index inside the consecutive occurrence is greater or equal to the number of
 * teams. This allows for the occurrence of multiple teams inside a single row,
 * e.g. for match tables
 *
 * Also hides the whole table if there's no entry in the table.
 *
 * TODO extract the teamsize logic to a ClassView+IsEmptyModel (or something)
 *
 * TODO make this a general TableView, which inherits from ListView and hides as
 * soon as the list is empty
 *
 * @return TeamTableView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "lib/extend", "core/view"], function ($, extend, View) {
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

    this.$names = this.$view.find("tr>th");

    this.updatePlayerColumns();
  }
  extend(TeamTableView, View);

  /**
   * show one column for each player in a team (teamsize)
   */
  TeamTableView.prototype.updatePlayerColumns = function () {
    var teamsize, teamindex;

    teamsize = this.model.get();
    teamindex = 0;

    this.$names.each(function (index, elem) {
      var $elem;

      $elem = $(elem);

      if ($elem.hasClass("playercol")) {
        if (teamindex < teamsize) {
          $elem.removeClass("hidden");
        } else {
          $elem.addClass("hidden");
        }
        teamindex += 1;
      } else {
        teamindex = 0;
      }
    });
  };

  /**
   * the team size changed. check player column visibility
   */
  TeamTableView.prototype.onupdate = function () {
    this.updatePlayerColumns();
  };

  return TeamTableView;
});
