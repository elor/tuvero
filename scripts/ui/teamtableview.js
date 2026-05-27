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
import $ from 'jquery'
import View from '../core/view.js'

/**
 * Constructor
 *
 * @param teamview
 *          a ListView of the table
 * @param teamsize
 *          a ValueModel instance of the team size
 */
class TeamTableView extends View {
  constructor (teamview, teamsize) {
    super(teamsize, teamview.$view)
    this.teamlist = teamview.model
    this.teamlist.registerListener(this)
    this.$names = this.$view.find('tr>th')
    this.updatePlayerColumns()
  }

  /**
   * show one column for each player in a team (teamsize)
   */
  updatePlayerColumns () {
    let teamindex
    const teamsize = this.model.get()
    teamindex = 0
    this.$names.each(function (index, elem) {
      const $elem = $(elem)
      if ($elem.hasClass('playercol')) {
        if (teamindex < teamsize) {
          $elem.removeClass('hidden')
        } else {
          $elem.addClass('hidden')
        }
        teamindex += 1
      } else {
        teamindex = 0
      }
    })
  }

  /**
   * the team size changed. check player column visibility
   */
  onupdate () {
    this.updatePlayerColumns()
  }
}

export default TeamTableView
