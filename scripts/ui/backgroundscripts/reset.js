/**
 * checks for the hash '#reset' and resets the localStorage, if it is ever
 * visited
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ '../toast', '../strings' ], function (Toast, Strings) {

  function hashcheck () {
    if (location.hash === '#reset') {
      console.log('clearing localstorage');
      localStorage.clear();

      new Toast(Strings.reset, Toast.LONG);
      location.hash = '#debug';

      return true;
    }
    return false;
  }

  $(window).on('hashchange', function () {
    if (hashcheck()) {
      location.reload();
    }
  });

  hashcheck();
});
