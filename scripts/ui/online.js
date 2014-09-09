/**
 * Am I online or offline?
 */
// FIXME modernizr
define(function () {
  var Online;

  /**
   * 
   */
  Online = function () {
    return navigator.onLine;
  };

  // if offline, send a nag message!

  // debug: nag every second

  setInterval(function () {
    new require('./toast')(Online() ? 'online' : 'offline');
  }, 1000);

  return Online;
});
