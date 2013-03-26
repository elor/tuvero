/**
 * A Toast is a small text which shows for a short period of time before
 * disappearing. You can supply a jquery object handle as str if you want to
 * insert an html node instead of text
 */
define(function () {
  var Toast, fadein, fadeout, pending;

  // pending toasts which have been issued before jquery was available
  pending = [];

  // temporary toast constructor
  Toast = function (str, seconds) {
    pending.push({
      str : str,
      seconds : seconds
    });
  };

  // wait for jquery
  $(function ($) {
    // create toast container
    $('body').append('<div id="toasts"></div>');

    // fade durations
    // TODO take fade times from getsomestyle.css
    fadein = 200;
    fadeout = 200;

    // actual Toast constructor
    Toast = function (str, seconds) {
      var $toasts, $div, $br;

      // default to two seconds duration
      seconds = seconds || 2;

      $toasts = $('#toasts');
      $div = $('<div></div>');
      $br = $('<br>');

      // decide between text and jquery object handle
      if (typeof str === 'string') {
        $div.text(str);
      } else {
        $div.append(str);
      }

      // insert the toast and a line break
      $toasts.append($div);
      $div.after($br);

      // fadein timeout
      window.setTimeout(function () {
        $div.addClass('toast');
      }, 10);

      // fadeout timeout
      window.setTimeout(function () {
        $div.removeClass('toast');
      }, 1000 * seconds + fadein);

      // remove timeout
      window.setTimeout(function () {
        $br.remove();
        $div.remove();
      }, 1000 * seconds + fadein + fadeout);
    };

    // issue any pending toasts
    pending.forEach(function (toast) {
      new Toast(toast.str, toast.seconds);
    }, this);
  });

  // remember: return by reference. The new function will replace the old one
  return Toast;
});
