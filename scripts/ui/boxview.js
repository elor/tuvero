import View from '../core/view.js'
import BoxController from './boxcontroller.js'
/**
 * Set the current tabbing state. This forbids tabbing into a collapsed box.
 *
 * @param $box
 *          the .boxview jQuery object
 */
function setTabbing ($box) {
  let i, $input
  const enable = !$box.hasClass('collapsed')
  const $inputs = $box.find('a, button, input, select, textarea')
  for (i = 0; i < $inputs.length; i += 1) {
    $input = $inputs.eq(i)
    if (enable) {
      if ($input.data().tabindex === undefined) {
        $input.removeAttr('tabindex')
      } else {
        $input.attr('tabindex', $input.data().tabindex)
      }
      delete $input.data().tabindex
    } else {
      $input.data().tabindex = $input.attr('tabindex')
      $input.attr('tabindex', -1)
    }
  }
}

/**
 * Constructor, which also creates the BoxController
 *
 * @param $box
 *          the .boxview jQuery object
 */
class BoxView extends View {
  constructor ($box) {
    super(undefined, $box)
    this.model.EVENTS = BoxView.EVENTS
    if (this.$view.hasClass('collapsed')) {
      // start collapsed, if specified
      setTabbing(this.$view.css('height', 0))
    }
    this.controller = new BoxController(this)
  }

  /**
   * reset to the expanded state
   */
  reset () {
    setTabbing(this.$view.removeClass('collapsed').css('height', '').css('transition', ''))
  }

  /**
   * update the box with a transition, e.g. after toggling its state
   */
  update () {
    /* jshint expr: true */

    let oldheight, targetheight
    const $box = this.$view
    if ($box.hasClass('collapsed')) {
      targetheight = 0
    } else {
      oldheight = $box.height()
      $box.css('transition', '')
      $box.css('height', '')
      this.forceHeightRecalculation()
      targetheight = $box.height()
      $box.css('height', oldheight)
      this.forceHeightRecalculation()
    }
    $box.css('height', $box.height())
    $box.css('transition', 'height 0.5s')
    this.forceHeightRecalculation()
    $box.css('height', targetheight)
    setTabbing($box)

    // reset the transition value
    setTimeout(function () {
      $box.css('transition', '')
      if (!$box.hasClass('collapsed')) {
        $box.css('height', '')
      }
    }, 500)
  }

  /**
   * toggle callback function
   */
  ontoggle () {
    this.$view.toggleClass('collapsed')
    this.update()
  }

  forceHeightRecalculation () {
    return this.$view[0].offsetHeight
  }

  static EVENTS = {
    toggle: true
  }
}

export default BoxView
