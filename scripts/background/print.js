/**
 * Print button logic, which triggers printing the current tab to paper.
 *
 * @return undefined
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
let Print
$(function ($) {
  $('#tabs').on('click', 'button.print', function () {
    window.print()
  })
})
export default Print
