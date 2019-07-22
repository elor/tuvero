/**
 * TournamentController
 *
 * @return TournamentController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/renamecontroller', 'ui/toast', 'ui/strings'],
  function (extend, RenameController, Toast, Strings) {
    var pendingNameChange

    pendingNameChange = undefined

    /**
   * Constructor
   *
   * @param view
   *          a TournamentView instance
   */
    function TournamentController (view, tournaments) {
      var tournament, $runbutton
      TournamentController.superconstructor.call(this, view, false)

      tournament = this.model.tournament

      this.toast = undefined

      this.$runbutton = this.view.$view.find('button.runtournament')
      this.$closebutton = this.view.$view.find('button.closetournament')

      $runbutton = this.$runbutton
      this.$runbutton.click(function () {
        $runbutton.attr('disabled', true)
        tournament.run()
        window.setTimeout(function () {
          $runbutton.attr('disabled', false)
        }, 500)
      })

      this.$closebutton.click(function () {
        if (tournament.finish()) {
          tournaments.closeTournament(tournament.getID())
          Toast.once(Strings.tournamentfinished)
        } else {
          Toast.once(Strings.gamesstillrunning, Toast.LONG)
        }
      })

      if (pendingNameChange === this.model.tournament) {
        this.view.$view.find('.rename').eq(0).click()
        window.setTimeout(this.$rename.focus.bind(this.$rename), 1)
        window.setTimeout(this.$rename.select.bind(this.$rename), 1)
      }
    }
    extend(TournamentController, RenameController)

    TournamentController.prototype.getName = function () {
      return this.model.tournament.getName().get()
    }

    TournamentController.prototype.setName = function (name) {
      if (!name) {
        return false
      }

      this.model.tournament.getName().set(name)

      pendingNameChange = undefined

      return true
    }

    TournamentController.initiateNameChange = function (tournament) {
      pendingNameChange = tournament
    }

    TournamentController.prototype.destroy = function () {
    }

    return TournamentController
  })
