/**
 * manages box click events, i.e. if you click the header, the box is collapsed
 */
define(function () {
  var Box;

  Box = {
    reset : function () {
      $('#tabs div.box.collapsed').removeClass('collapsed').css('height', '').css('transition', '');
    }
  };

  $(function ($) {
    $('#tabs').on('click', 'div.box > h3:first-child', function () {
      var $box, targetheight, oldheight;

      $box = $(this).parent();
      $box.toggleClass('collapsed');

      if ($box.hasClass('collapsed')) {
        targetheight = 0;
      } else {
        oldheight = $box.height();
        $box.css('transition', '');
        $box.css('height', '');
        $box[0].offsetHeight;

        targetheight = $box.height();
        $box.css('height', oldheight);
        $box[0].offsetHeight;
      }
      $box.css('height', $box.height());
      $box.css('transition', 'height 0.5s');
      $box[0].offsetHeight;
      $box.css('height', targetheight);

      // reset the transition value
      setTimeout(function () {
        $box.css('transition', '');
      }, 500);
    });
  });

  return Box;
});
