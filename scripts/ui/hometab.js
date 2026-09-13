import $ from 'jquery'
import View from '../core/view.js'
import Strings from './strings.js'
import Browser from './browser.js'
import TimeMachineView from './timemachineview.js'
import StateSaver from './statesaver.js'
import StateFileLoadController from './statefileloadcontroller.js'
import Server from './server.js'
import LoginView from './loginview.js'
import ServerTournamentListModel from './servertournamentlistmodel.js'
import ServerTournamentView from './servertournamentview.js'
import ListView from './listview.js'
import ServerAutoloadModel from './serverautoloadmodel.js'
import State from './state.js'
import wireDialog from './dialogcontroller.js'
import Listener from '../core/listener.js'
import { linkTournament } from '../background/serverlinker.js'

/**
 * represents a whole team tab
 *
 * TODO write a TabView superclass with common functions
 *
 * TODO isolate common tab-related function
 *
 * @param $tab
 *          the tab DOM element
 */
class HomeTab extends View {
  constructor ($tab) {
    super(undefined, $tab)
    this.init()
  }

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  init () {
    let $button, $container

    // TODO move to a controller
    $button = this.$view.find('button.reset')
    $button.click(function () {
      if (window.confirm(Strings.clearstorage)) {
        StateSaver.removeEverything()
      }
    })

    // TODO move to a view
    const $errorlink = this.$view.find('a.errorlink')
    $errorlink.attr('href', $errorlink.attr('href') + '&browser=' + Browser.name + ' ' + Browser.version)

    /*
     * Time Machine
     */
    $container = this.$view.find('.timemachineview')
    this.timeMachineView = new TimeMachineView($container)

    /*
     * "Neues Turnier" dialog. Creation itself stays with the existing
     * TimeMachineNewTreeController (input.treename/button.createroot
     * keep their classes); this only opens/closes the dialog and, for
     * variants with a team-size choice (boule: Tête/Doublette/
     * Triplette), applies the selected size to the fresh state.
     */
    const $dialog = this.$view.find('dialog.newtournamentdialog')
    wireDialog($dialog, this.$view.find('button.newtournament'))
    // "Direkt online anlegen" needs a server session; greyed out
    // (with the checkmark cleared) while logged out.
    const $createonline = $dialog.find('input.createonline')
    const updateCreateOnline = function () {
      const loggedIn = !!Server.logged_in.get()
      $createonline.prop('disabled', !loggedIn)
      $createonline.closest('label')
        .attr('title', loggedIn ? '' : Strings.not_logged_in)
      if (!loggedIn) {
        $createonline.prop('checked', false)
      }
    }
    updateCreateOnline()
    Listener.bind(Server.logged_in, 'update', updateCreateOnline)
    $dialog.find('button.createroot').on('click', function () {
      const size = $dialog.find('input[name="newteamsize"]:checked').val()
      const createOnline = $createonline.prop('checked')
      window.setTimeout(function () {
        if (size) {
          State.teamsize.set(parseInt(size, 10))
        }
        if (createOnline) {
          // the controller created + loaded the tree synchronously;
          // mint the server twin (named after the active tree) and
          // start auto-uploading
          linkTournament()
        }
        const dialog = $dialog.get(0)
        if (dialog && dialog.open) {
          dialog.close()
        }
      }, 0)
    })

    /*
     * "Turnier öffnen" dialog: file, server (searchable dialog), or
     * switch over to the create dialog. closeOnAction closes it when
     * any of the three is chosen; the chained dialogs open on the
     * same click via their own wireDialog openers.
     */
    const $openDialog = this.$view.find('dialog.opentournamentdialog')
    wireDialog($openDialog, this.$view.find('button.opentournament'),
      { closeOnAction: true })
    wireDialog(this.$view.find('dialog.servertournamentdialog'),
      $openDialog.find('button.openserver'))
    wireDialog($dialog, $openDialog.find('button.switchcreate'))

    /*
     * tournament loader
     */
    $button = this.$view.find('button.load')
    this.fileLoadController = new StateFileLoadController($button)

    /*
     * LoginView, ServerTournamentView
     */

    this.serverAutoloadModel = new ServerAutoloadModel(Server)
    this.serverTournamentListModel = new ServerTournamentListModel(Server)
    $container = this.$view.find('.servertournaments').not('.serverdialoglist')
    const $template = $container.find('.template')
    this.serverTournamentListView = new ListView(this.serverTournamentListModel, $container, $template, ServerTournamentView)

    /*
     * the same list again inside the "Vom Server öffnen" dialog, with
     * text search and a simple date filter
     */
    const $serverDialog = this.$view.find('dialog.servertournamentdialog')
    const $dialogList = $serverDialog.find('.serverdialoglist')
    this.serverDialogListView = new ListView(this.serverTournamentListModel,
      $dialogList, $dialogList.find('.template'), ServerTournamentView)
    const filterServerRows = function () {
      const query = ($serverDialog.find('input.serversearch').val() || '')
        .toString().trim().toLowerCase()
      const range = $serverDialog.find('select.serverdaterange').val()
      const today = new Date().toISOString().slice(0, 10)
      let visible = 0
      $dialogList.find('.servertournamentview').not('.template')
        .each(function () {
          const $row = $(this)
          const name = ($row.find('.name').text() || '').toLowerCase()
          const startdate = $row.attr('data-startdate') || ''
          let show = !query || name.indexOf(query) !== -1
          // an explicit text search overrides the date filter — a
          // name match hidden by "Kommende" reads as a broken search
          if (show && !query && range === 'upcoming') {
            show = !startdate || startdate >= today
          } else if (show && !query && range === 'past') {
            show = !!startdate && startdate < today
          }
          $row.toggleClass('filteredout', !show)
          if (show && !$row.hasClass('haslocal')) {
            visible += 1
          }
        })
      $serverDialog.toggleClass('noresultsvisible', visible === 0)
    }
    $serverDialog.on('input change', '.serversearch, .serverdaterange', filterServerRows)
    $serverDialog.find('button.openserver, .serversearch').on('focus', filterServerRows)
    $openDialog.find('button.openserver').on('click', function () {
      window.setTimeout(filterServerRows, 0)
    })
    $container = this.$view.find('.loginview')
    this.loginView = new LoginView(Server, $container)
    if (!Server.token.get()) {
      this.loginView.loginWindowSuppressed.set(true)
      Server.createToken()
    }
  }
}

// FIXME CHEAP HACK AHEAD
$(function ($) {
  const $tab = $('#tabs > [data-tab="home"]')
  if ($tab.length && $('#testmain').length === 0) {
    return new HomeTab($tab)
  }
})
export default HomeTab
