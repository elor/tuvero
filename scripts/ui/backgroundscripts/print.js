/**
 * manages box click events, i.e. if you click the header, the box is collapsed
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  $(function ($) {
    $('#tabs').on('click', 'button.print', function () {
      window.print();
    });
  });

  return undefined;
});
