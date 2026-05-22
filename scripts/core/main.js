/**
 * Shared main file. loads the shared config and modules and manages the program
 * startup and splash screen. A complete rewrite is necessary.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import './common.js';
import Splash from '../ui/splash.js';
import Toast from '../ui/toast.js';
import Strings from '../ui/strings.js';
import StateLoader from '../ui/stateloader.js';
import TeamToastsListener from '../ui/teamtoastslistener.js';

function notifyAboutLoadError (err) {
  console.log(err)

  $(function () {
    let $splash;

    // Splash.setState(), but without splash being loaded
    $('body').addClass('splash')
    $splash = $('#splash')
    $splash.removeClass()
    $splash.addClass('loaderror')
    $('#tabs').hide()
  })
}

$(function () {
  if (!Splash.valid) {
    console.error('Splash screen indicates browser incompatibilities')
    return
  }

  Splash.loading()

  // using a timeout to let the browser update the splashtext
  setTimeout(function () {
    let loaded;

    try {
      try {
        loaded = StateLoader.loadLatest()
      } catch (e) {
        console.error(e.stack)
        Toast.init()
        Splash.error()
        return
      }

      if (loaded) {
        Toast.once(Strings.loaded)
      } else {
        Toast.once(Strings.newtournament)
      }

      TeamToastsListener.init()

      Splash.update()

      setTimeout(function () {
        try {
          Toast.init()
          Splash.hide()
        } catch (er) {
          notifyAboutLoadError(er)
        }
      }, 10)
    } catch (err) {
      console.error('StateLoader.loadLatest() error caught')
      console.error(err)
      Splash.error()
    }
  }, 1)
})
