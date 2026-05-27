/**
 * Controller for finishing a Match
 *
 * TODO use ValueModel events to communicate the values, not jquery events
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Controller from '../core/controller.js'
import Options from 'options'

/**
 * Constructor
 *
 * @param view
 *          the associated MatchView
 */
class MatchController extends Controller {
  constructor (view, $form) {
    super(view)
    this.$form = $form
    this.$acceptbutton = this.$form.find('button.accept')
    this.$cancelbutton = this.$form.find('button.cancel')
    this.$scores = this.$form.find('.score')
    this.$scores.val(Options.defaultscore || 0)
    this.$acceptbutton.click(this.accept.bind(this))
    this.$cancelbutton.click(this.cancel.bind(this))
    this.initKeyListeners()
    this.initNumberValidation()
    this.updateButtonStatus()
  }

  initKeyListeners () {
    let $lastinput
    const controller = this
    this.$form.keydown(function (e) {
      switch (e.which) {
        case 27:
          // escape
          controller.cancel()
          break
        case 13:
          // enter
          controller.accept()
          break
        case 9:
          // tab
          if (e.shiftKey) {
            return
          }
          if (controller.$acceptbutton.filter(':not(.hidden)').length !== 0) {
            return
          }
          $lastinput = controller.$scores.eq(controller.$scores.length - 1)
          if ($lastinput.data() !== $(e.target).data()) {
            return
          }
          if (controller.accept()) {
            break
          }
          return
        default:
          return
      }
      e.preventDefault()
      return false
    })
  }

  initNumberValidation () {
    const controller = this

    // select the whole input field on focus. make id DAU-safe.
    this.$scores.click(function () {
      $(this).select()
    })

    // We're using keyup to check the values as the user types, not only
    // when
    // the focus is lost or the value is changed incrementally
    this.$scores.on('change keyup', function () {
      let value, valid
      valid = true
      const $this = $(this)
      value = $this.val()
      if (value.length === 0) {
        valid = false
      } else {
        value = Number(value)
        if (isNaN(value)) {
          valid = false
        } else if (value < Options.minpoints) {
          valid = false
        } else if (value > Options.maxpoints) {
          valid = false
        }
      }
      if (valid) {
        $this.removeClass('invalid')
      } else {
        $this.addClass('invalid')
      }
      controller.updateButtonStatus()
    }).attr('min', Options.minpoints).attr('max', Options.maxpoints)
  }

  updateButtonStatus () {
    this.$acceptbutton.prop('disabled', !this.validateScore())
  }

  validateScore () {
    let valid, tie, firstpoints, maxpoints
    valid = this.$scores.filter('.invalid').length === 0
    if (valid && (Options.tiesforbidden || Options.maxpointtiesforbidden)) {
      tie = true
      firstpoints = undefined
      this.$scores.each(function () {
        const points = Number($(this).val())
        if (firstpoints === undefined) {
          firstpoints = points
        }
        if (points !== firstpoints) {
          tie = false
        }
      })
      if (tie && Options.tiesforbidden) {
        valid = false
      }
      maxpoints = Number(this.$scores.eq(0).val()) === Options.maxpoints
      if (tie && maxpoints && Options.maxpointtiesforbidden) {
        valid = false
      }
    }
    return valid
  }

  /**
   * finish the match with the entered result, if it's valid.
   *
   * @return true on success, false otherwise
   */
  accept () {
    if (!this.validateScore()) {
      return false
    }
    const points = []
    this.$scores.each(function (i) {
      points[i] = Number($(this).val())
    })
    this.model.finish(points)
    return true
  }

  /**
   * cancel the input. Please overload where necessary
   */
  cancel () {
    // inherit if necessary. Usual result submissions cannot be canceled
    // We could reset the points, however
  }
}

export default MatchController
