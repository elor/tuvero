/**
 * A Toast is a small text which is visible for a short period of time before
 * disappearing.
 * 
 * You can supply a jquery object handle as str if you want to
 * insert an html node instead of text.
 * 
 * Toast duration can be set at Toast construction or controlled via a close()
 * function
 * 
 * @exports Toast
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  var Toast, fadein, fadeout, pending, toastfn, nextid, fadeoutfn;

  // pending toasts which have been issued before jquery was available
  pending = [];
  nextid = 0;

  function getid () {
    var id;
    id = nextid;
    nextid += 1;
    return id;
  }

  // will become a function once jquery has been initialized
  fadeoutfn = undefined;

  toastfn = function (str, seconds) {
    var id;

    id = getid();

    pending.push({
      str : str,
      seconds : seconds,
      id : id,
    });

    return id;
  };

  function createCloseFunction (id) {
    return function () {
      var i, $alltoasts, $div;
      if (pending[id]) {
        pending[id] = undefined;
      }

      // see if jquery has been initialized
      if (fadeoutfn) {
        $alltoasts = $('#toasts .toast');
        for (i = 0; i < $alltoasts.length; i += 1) {
          $div = $alltoasts.eq(i);
          if ($div.data().id === id) {
            fadeoutfn($div);
          }
        }
      }
    };
  }

  // temporary toast constructor
  Toast = function (str, seconds) {
    var id;

    id = toastfn(str, seconds);

    this.close = createCloseFunction(id);
  };

  Toast.init = function () {
    var $hidden, transition, duration, id;
    // create toast container
    $('body').append('<div id="toasts"><div class="hidden" style="display:none;">ERROR</div></div>');

    function getTransitionDuration () {
      var prefix, prefixes, transition;

      // TODO remove prefixes from this file
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
        return getid();
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

        // decide between text and jquery object handle
        if (typeof str === 'string') {
          $div.text(str);
        } else {
          $div.append(str);
        }

        // insert the toast and a line break
        $toasts.append($div);
        $div.after($('<br>'));

        // fadein timeout
        window.setTimeout(function () {
          $div.addClass('toast');
        }, 10);

        // remove the toast if it's not infinite
        if (seconds > 0) {
          // fadeout timeout
          window.setTimeout(function () {
            fadeoutfn($div);
          }, 1000 * (seconds + fadein));
        }

        id = getid();
        $div.data().id = id;
        return id;
      };

      fadeoutfn = function ($div) {
        // remove timeout
        $div.removeClass('toast');
        window.setTimeout(function () {
          $div.next().remove();
          $div.remove();
        }, 1000 * fadeout);
      };
    }

    // issue any pending toasts
    pending.forEach(function (toast) {
      if (toast) {
        new Toast(toast.str, toast.seconds);
      }
    }, this);
  };

  Toast.SHORT = 2;
  Toast.LONG = 5;
  Toast.INFINITE = -1;

  // remember: return by reference. The new function will replace the old one
  return Toast;
});
