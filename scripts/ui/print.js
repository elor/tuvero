/**
 * manages box click events, i.e. if you click the header, the box is collapsed
 */
define(function () {
  var Print;

  $(function ($) {
    $('#tabs').on('click', 'button.print', function () {
      window.print();
    });
  });

  return undefined;
});
