/**
 * manages box click events, i.e. if you click the header, the box is collapsed
 */
define(function () {
  var Box;

  Box = {
    reset : function () {
      $('#tabs div.box.collapsed').removeClass('collapsed');
    }
  };

  $(function ($) {
    $('#tabs').on('click', 'div.box > h3:first-child', function () {
      var $box;

      $box = $(this).parent();

      $box.toggleClass('collapsed');

      if ($box.hasClass('collapsed')) {
        $box.css('height', $box.height());
        $box.css('transition', 'height 0.5s');
        $box[0].offsetHeight;
        $box.css('height', '0');
      } else {
        $box.css('height', '');
      }
    });
  });

  return Box;
});
