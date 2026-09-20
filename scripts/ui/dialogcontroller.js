/**
 * Wire a native <dialog>: opens on the opener button, closes on
 * backdrop click, ESC (built-in), [data-close] buttons and —
 * optionally — after any action button inside.
 *
 * Native dialogs render in the browser's top layer, so they are
 * immune to the .boxview overflow clipping that broke the earlier
 * dropdown approach.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

function wireDialog ($dialog, $opener, options) {
  const dialog = $dialog.get(0)
  if (!dialog || !dialog.showModal) {
    return
  }
  $opener.on('click', function () {
    dialog.showModal()
  })
  /*
   * Light dismiss. A click on the dialog element itself is *not*
   * enough to call it a backdrop click: the dialog's own padding
   * belongs to the visible box, and a click that lands between two
   * children hits the dialog element while being inside the box.
   * Ask the geometry instead, and require the press to have started
   * outside too, so dragging a selection out of the dialog does not
   * close it either.
   */
  function isOutside (event) {
    if (event.target !== dialog) {
      return false
    }
    const rect = dialog.getBoundingClientRect()
    return event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom
  }
  let pressedOutside = false
  $dialog.on('mousedown', function (event) {
    pressedOutside = isOutside(event)
  })
  $dialog.on('click', function (event) {
    if (pressedOutside && isOutside(event)) {
      dialog.close()
    }
  })
  $dialog.find('[data-close]').on('click', function () {
    dialog.close()
  })
  if (options && options.closeOnAction) {
    $dialog.on('click', 'button:not([data-close])', function () {
      // let the action's own handlers run first
      window.setTimeout(function () {
        dialog.close()
      }, 0)
    })
  }
}

export default wireDialog
