define([
  'jquery',
  'lib/extend',
  'core/controller',
  'ui/state'
], function ($, extend, Controller, State) {
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  function numberToAlphaString (number) {
    if (number < 0) {
      return ''
    }

    if (number > alphabet.length) {
      return numberToAlphaString(Math.floor(number) / 26) + numberToAlphaString(number % alphabet.length)
    }

    return alphabet[number]
  }

  function PoulesTournamentController (view) {
    var $mode, $seed, $byepoules, $byeteams, $numpoules, tournament

    PoulesTournamentController.superconstructor.call(this, view)

    tournament = this.model.tournament

    $mode = this.view.$mode
    $seed = this.view.$seed
    $byepoules = this.view.$byepoules
    $byeteams = this.view.$byeteams
    $numpoules = this.view.$numpoulesinput

    this.view.$view.find('button.flipranking').click(function () {
      tournament.flipGroupRankings()
    })

    this.view.$view.find('button.finalizeranking').click(function () {
      tournament.flipGroupRankings(['poulerank', 'pouleid'])
    })

    this.view.$view.find('button.canonicalteamnames').click(function () {
      tournament.getGroups().forEach(function (group, groupID) {
        group.forEach(function (teamID, teamNumber) {
          var team = State.teams.get(teamID)
          team.number = numberToAlphaString(groupID) + (teamNumber + 1)
          team.emit('update')
        })
      })
    })

    $mode.change(function () {
      tournament.setProperty('poulesmode', $(this).val())
      $mode.val($(this).val())
    })

    $seed.change(function () {
      tournament.setProperty('poulesseed', $(this).val())
      $seed.val($(this).val())
    })

    $byepoules.change(function () {
      tournament.setProperty('poulesbyepoules', $(this).val())
      $byepoules.val($(this).val())
    })

    $byeteams.change(function () {
      tournament.setProperty('poulesbyeteams', $(this).val())
      $byeteams.val($(this).val())
    })

    $numpoules.change(function () {
      tournament.numpoules.set(Number($(this).val()))
    })
  }
  extend(PoulesTournamentController, Controller)

  return PoulesTournamentController
})
