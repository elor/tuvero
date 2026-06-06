/**
 * A Toast is a small text which is visible for a short period of time before
 * disappearing.
 *
 * You can supply a jquery object handle as str if you want to insert an html
 * node instead of text.
 *
 * Toast duration can be set at Toast construction or controlled via a close()
 * function
 *
 * @return Toast
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Type from '../core/type.js'
let initialized, pending

// pending toasts which have been issued before jquery was available
initialized = false
pending = []

/**
 * read the transition durations
 */
function getTransitionDuration () {
  const transition = Toast.$template.css('transition')
  if (transition === undefined) {
    console.error('could not read any transition lengths. ' + "What's your browser?")
    return 0.2
  }

  // return duration
  return Number(transition.replace(/^[^0-9]*([0-9.]+)s.*$/, '$1'))
}

/**
 * toast constructor
 *
 * @param str
 *          the string of the toast
 * @param seconds
 *          Toast duration in seconds. See Toast.SHORT, Toast.LONG and
 *          Toast.INFINITE. Defaults to Toast.SHORT.
 */
class Toast {
  constructor (message, seconds) {
    this.message = message
    this.duration = seconds || Toast.SHORT
    this.$toast = undefined
    if (initialized) {
      this.display()
    } else {
      pending.push(this)
    }
  }

  /**
   * display a toast
   */
  display () {
    if (!initialized) {
      console.error('Cannot display Toast: ' + 'Toast.init() has not been called yet.')
      return
    }
    if (this.$toast) {
      console.error('toast is already visible')
      return
    }
    const $toast = this.$toast = Toast.$template.clone().removeClass('hidden')

    // decide between text and jquery object handle
    if (Type.isString(this.message)) {
      this.$toast.text(this.message)
    } else {
      this.$toast.append(this.message)
    }

    // insert the toast and a line break
    Toast.$container.append(this.$toast)
    Toast.$container.append('<br>')

    // let the toast fade in
    window.setTimeout(function () {
      $toast.addClass('toast')
    }, 10)

    // Let the toast fade out if it's not infinite
    if (this.duration > 0) {
      window.setTimeout(this.close.bind(this), 1000 * (this.duration + Toast.fadeinDuration))
      $toast.addClass('temporary')
    } else {
      $toast.addClass('infinite')
    }
  }

  /**
   * create a function which closes the toast
   *
   * @param id
   *          the toast id
   * @return a close function
   */
  close () {
    if (initialized && this.$toast) {
      const $toast = this.$toast

      // let the toast fade out
      $toast.removeClass('toast')

      // remove the toast after fadeout
      window.setTimeout(function () {
        $toast.next().remove()
        $toast.remove()
      }, 1000 * Toast.fadeoutDuration)

      // forbid the close function from fading out a second time
      this.$toast = undefined
    } else if (pending && pending.indexOf(this) !== -1) {
      pending.splice(pending.indexOf(this), 1)
    }
  }

  /**
   * initialize the toast. This function has to be called explicitly, or the
   * unit tests show toasts for every error.
   */
  static init () {
    Toast.$container = $('<div id="toasts">')
    Toast.$template = $('<div class="hidden">ERROR</div>')
    Toast.fadeinDuration = getTransitionDuration()
    Toast.fadeoutDuration = getTransitionDuration()
    Toast.$container.append(Toast.$template)
    $('body').append(Toast.$container)

    // abort if the style is not set
    if ($('#toasts').css('position') !== 'fixed') {
      console.error('Toast: stylesheet not found. Initialization failed.')
    } else {
      Toast.$template.addClass('toast')
      if (Toast.fadeinDuration !== Number(Toast.fadeinDuration) || !isFinite(Toast.fadeinDuration) || isNaN(Toast.fadeinDuration)) {
        console.error('Toast.fadeinDuration: not a valid number: ' + Toast.fadeinDuration)
        Toast.$template.removeClass('hidden')
      }
      if (Toast.fadeoutDuration !== Number(Toast.fadeoutDuration) || !isFinite(Toast.fadeoutDuration) || isNaN(Toast.fadeoutDuration)) {
        console.error('Toast.fadeoutDuration: not a valid number: ' + Toast.fadeoutDuration)
        Toast.$template.removeClass('hidden')
      }
    }
    initialized = true

    // issue any pending toasts
    pending.forEach(function (toast) {
      toast.display()
    }, this)
    pending = undefined
  }

  static closeTemporaryToasts () {
    Toast.$container.find('.toast.temporary').each(function () {
      const $toast = $(this)
      $toast.next().hide()
      $toast.hide()
    })
  }

  static once (message, seconds) {
    return new Toast(message, seconds)
  }

  static fadeinDuration = 0.2
  static fadeoutDuration = 0.2
  static $container = undefined
  static $template = undefined
  static SHORT = 2
  static LONG = 5
  static INFINITE = -1
}

// remember: return by reference. The new function will replace the old
// one
export default Toast
