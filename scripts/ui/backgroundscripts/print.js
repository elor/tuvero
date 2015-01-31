/**
 * Print button logic, which triggers printing the current tab to paper.
 *
 * @return undefined
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  $(function($) {
    $('#tabs').on('click', 'button.print', function() {
      window.print();
    });
  });

  return undefined;
});
