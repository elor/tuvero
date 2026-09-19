/**
 * The app-wide export dialog: tournament state file plus the CSV
 * tables. The tournament menu and the settings page both open it,
 * so there is one place that answers "how do I get my data out".
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from '../core/view.js'
import TimeMachine from '../timemachine/timemachine.js'
import FileSaverModel from './filesavermodel.js'
import CSVExportController from './csvexportcontroller.js'
import Toast from './toast.js'
import Strings from './strings.js'
import wireDialog from './dialogcontroller.js'

// whose state the file download writes; set by the opener, falls
// back to the tournament currently loaded
let target

/**
 * @param commit optional CommitModel — the tournament menu passes
 *        its own box, the settings page passes nothing
 */
export function openExportDialog (commit) {
  target = commit
  const dialog = $('dialog.exportdialog').get(0)
  if (dialog && dialog.showModal) {
    dialog.showModal()
  }
}

$(function ($) {
  const $dialog = $('dialog.exportdialog')
  if (!$dialog.length) {
    return
  }
  // scoped to .csvexports: the controller reads dataset names off
  // every button it is given, and "Schließen" is not a dataset
  const csvController = new CSVExportController(
    new View(undefined, $dialog.find('.csvexports'))
  )
  $dialog.data('csvController', csvController)

  $dialog.find('button.statedownload').on('click', function () {
    const commit = target || TimeMachine.commit.get()
    if (!commit) {
      Toast.once(Strings.notournament, Toast.LONG)
      return
    }
    const fileSaver = new FileSaverModel(
      commit.getYoungestDescendant() || commit
    )
    if (!fileSaver.save()) {
      Toast.once(Strings.savefailed)
    }
  })

  wireDialog($dialog, $())
})
