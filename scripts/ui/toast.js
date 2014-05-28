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
    var $hidden, transition, duration, regex;
    // create toast container
    $('body').append('<div id="toasts"><div class="hidden" style="display:none;">ERROR</div></div>');

    // abort if the style is not set
    if ($('#toasts').css('position') !== 'absolute') {
      console.error('Toast: stylesheet not found');
      Toast = function (str, seconds) {
        console.error('Toast: ' + str);
      };
    } else {
      // read fade durations from css
      $hidden = $('#toasts .hidden');
      regex = /^all ([0-9.]+)s ease-(in|out) ([0-9.]+)s$/;

      transition = $hidden.css('transition');
      duration = Number(transition.replace(regex, '$1'));
      fadeout = duration;

      $hidden.addClass('toast');

      transition = $hidden.css('transition');
      duration = Number(transition.replace(regex, '$1'));
      fadein = duration;

      if (fadein != Number(fadein) || !isFinite(fadein) || isNaN(fadein)) {
        console.error('fadein: not a valid number: ' + fadein);
        $hidden.show();
      }

      if (fadeout != Number(fadeout) || !isFinite(fadeout) || isNaN(fadeout)) {
        console.error('fadeout: not a valid number: ' + fadeout);
        $hidden.show();
      }

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
        // TODO on toast fadeout: move whole column upwards
        window.setTimeout(function () {
          $div.removeClass('toast');
        }, 1000 * (seconds + fadein));

        // remove timeout
        window.setTimeout(function () {
          $br.remove();
          $div.remove();
        }, 1000 * (seconds + fadein + fadeout));
      };
    }

    // issue any pending toasts
    pending.forEach(function (toast) {
      new Toast(toast.str, toast.seconds);
    }, this);
  });

  // remember: return by reference. The new function will replace the old one
  return Toast;
});
