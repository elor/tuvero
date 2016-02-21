/**
 * Clears all stored data when the user visits the '#reset' target.
 *
 * This is intended as a fallback solution when loading fails or old saves are
 * no longer compatible. Do not use this for clearing the storage, because the
 * page will be reloaded unnecessarily.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['../toast', '../strings', 'jquery'], function(Toast, Strings, $) {
  var Reset = undefined;

  function hashcheck() {
    if (location.hash === '#reset') {
      console.log('clearing localstorage');
      window.localStorage.clear();

      new Toast(Strings.reset, Toast.LONG);
      window.location.hash = '#debug';

      return true;
    }
    return false;
  }

  $(window).on('hashchange', function() {
    if (hashcheck()) {
      location.reload();
    }
  });

  // also bind the reset button by delegating its click to a Tab_Storage element
  $(function($) {
    $('#tabs').on('click', 'button.reset', function(e) {
      $('#tabs > [data-tab="settings"] .local button.clear').click();
    });
  });

  hashcheck();

  return Reset;
});
