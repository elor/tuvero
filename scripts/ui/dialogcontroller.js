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
  $dialog.on('click', function (event) {
    // a click on the dialog element itself is a backdrop click
    if (event.target === dialog) {
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
