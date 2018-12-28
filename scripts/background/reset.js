/**
 * Clears all stored data when the user visits the '#reset' target.
 *
 * This is intended as a fallback solution when loading fails or old saves are
 * no longer compatible. Do not use this for clearing the storage, because the
 * page will be reloaded unnecessarily.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/toast', 'timemachine/timemachine', 'ui/strings', 'jquery'], //
  function (Toast, TimeMachine, Strings, $) {
    var Reset

    function hashcheck () {
      if (window.location.hash === '#reset') {
        console.log('clearing localstorage')
        if (window.localStorage) {
          window.localStorage.clear()
        }

        TimeMachine.updateRoots()

        Toast.once(Strings.reset, Toast.LONG)
        window.location.hash = '#debug'

        return true
      }
      return false
    }

    $(window).on('hashchange', function () {
      if (hashcheck()) {
        window.location.reload()
      }
    })

    // also bind the reset button by delegating its click to a Tab_Storage
    // element
    $(function ($) {
      $('#tabs').on('click', 'button.reset', function (e) {
        $('#tabs > [data-tab="settings"] .local button.clear').click()
      })
    })

    hashcheck()

    return Reset
  })
