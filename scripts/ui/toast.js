/**
 * A Toast is a small text which shows for a short period of time before
 * disappearing. You can supply a jquery object handle as str if you want to
 * insert an html node instead of text
 */
define(function () {
  var Toast, fadein, fadeout, pending, toastfn;

  // pending toasts which have been issued before jquery was available
  pending = [];

  toastfn = function (str, seconds) {
    pending.push({
      str : str,
      seconds : seconds
    });
  };

  // temporary toast constructor
  Toast = function (str, seconds) {
    toastfn(str, seconds);
  };

  Toast.init = function () {
    var $hidden, transition, duration;
    // create toast container
    $('body').append('<div id="toasts"><div class="hidden" style="display:none;">ERROR</div></div>');

    function getTransitionDuration () {
      var prefix, prefixes, transition;

      prefixes = [ '', '-o-', '-ms-', '-moz-', '-webkit-' ];
      transition = undefined;

      for (prefix in prefixes) {
        prefix = prefixes[prefix];
        transition = $hidden.css(prefix + 'transition');
        if (transition) {
          break;
        }
      }
      if (transition === undefined) {
        console.error("could not read any transition lengths. What's your browser?");
        return 0.2;
      }

      // return duration
      return Number(transition.replace(/^[^0-9]*([0-9.]+)s.*$/, '$1'));
    }

    // abort if the style is not set
    if ($('#toasts').css('position') !== 'fixed') {
      console.error('Toast: stylesheet not found');
      toastfn = function (str, seconds) {
        console.error('Toast: ' + str);
      };
    } else {
      // read fade durations from css
      $hidden = $('#toasts .hidden');

      fadeout = getTransitionDuration();

      $hidden.addClass('toast');

      fadein = getTransitionDuration();

      if (fadein != Number(fadein) || !isFinite(fadein) || isNaN(fadein)) {
        console.error('fadein: not a valid number: ' + fadein);
        $hidden.show();
      }

      if (fadeout != Number(fadeout) || !isFinite(fadeout) || isNaN(fadeout)) {
        console.error('fadeout: not a valid number: ' + fadeout);
        $hidden.show();
      }

      // actual Toast constructor
      toastfn = function (str, seconds) {
        var $toasts, $div, $br;

        // default to two seconds duration
        seconds = seconds || Toast.SHORT;

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

        // remote the toast if it's not infinite
        if (seconds > 0) {
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
        }
      };
    }

    // issue any pending toasts
    pending.forEach(function (toast) {
      new Toast(toast.str, toast.seconds);
    }, this);
  };

  Toast.SHORT = 2;
  Toast.LONG = 5;
  Toast.INFINITE = -1;

  // remember: return by reference. The new function will replace the old one
  return Toast;
});
