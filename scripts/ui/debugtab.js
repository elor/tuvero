import $ from 'jquery';
import View from '../core/view.js';
import Storage from './storage.js';
import Strings from './strings.js';
import Toast from './toast.js';
import LoadedImagesView from './loadedimagesview.js';
import BrowserInfoView from './browserinfoview.js';
import RegisterTeamsController from './registerteamscontroller.js';
import RegisterIDsController from './registeridscontroller.js';
import RequireModsShortcut from './requiremodsshortcut.js';
import FinishRoundController from './finishroundcontroller.js';
import Debug from './debug.js';
import TabsHandle from './tabshandle.js';
import StateSaver from './statesaver.js';
import StartRoundController from './startroundcontroller.js';
import RankingRecalcController from './rankingrecalccontroller.js';
import SaveToStorageButtonController from './savetostoragebuttoncontroller.js';
import FixTeamNumberController from './fixteamnumbercontroller.js';
import RandomPlacesButtonController from './randomplacesbuttoncontroller.js';

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
class DebugTab extends View {
  constructor($tab) {
    super(undefined, $tab);
    this.init();
  }

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  init() {
    let $container, $button;

    /*
     * Show Tab in dev versions
     */
    if (!Debug.isDevVersion) {
      TabsHandle.secret('debug');
    }

    /*
     * show browser info
     */
    $container = this.$view.find('.browser');
    this.browserNameView = new BrowserInfoView($container);

    /*
     * button: clear all
     */
    $container = this.$view.find('.register .delete');
    $container.click(function () {
      StateSaver.removeEverything();
      Storage.clear();
      if (window.localStorage) {
        window.localStorage.clear();
      }
      Toast.once(Strings.reset);
    });

    /*
     * images at pageload
     */
    $container = this.$view.find('.allimages');
    this.allImages = new LoadedImagesView($container);

    /*
     * buttons: register teams
     */
    $button = this.$view.find('button.registerteams');
    $container = this.$view.find('input.numteams');
    this.registerTeamsController = new RegisterTeamsController($button, $container);

    /*
     * buttons: register teams
     */
    $button = this.$view.find('button.registerids');
    $container = this.$view.find('input.numteams');
    this.registerIDsController = new RegisterIDsController($button,
    //
    $container);
    this.mods = new RequireModsShortcut();

    /*
     * button: start and finish rounds/matches
     */
    $button = this.$view.find('button.finishround');
    this.finishRound = new FinishRoundController($button);
    $button = this.$view.find('button.finishroundrandom');
    this.finishRoundRandom = new FinishRoundController($button, true);
    $button = this.$view.find('button.startround');
    this.startRound = new StartRoundController($button);

    /*
     * button: ranking recalculation
     */
    $button = this.$view.find('button.recalcranking');
    this.recalcRanking = new RankingRecalcController($button);
    $button = this.$view.find('button.fixteamids');
    this.savetostorage = new FixTeamNumberController($button);
    $button = this.$view.find('button.savetostorage');
    this.savetostorage = new SaveToStorageButtonController($button);
    $button = this.$view.find('button.randomplaces');
    this.savetostorage = new RandomPlacesButtonController($button);
  }
}

// FIXME CHEAP HACK AHEAD
$(function ($) {
  let $tab;
  $tab = $('#tabs > [data-tab="debug"]');
  if ($tab.length && $('#testmain').length === 0) {
    return new DebugTab($tab);
  }
});
export default DebugTab;