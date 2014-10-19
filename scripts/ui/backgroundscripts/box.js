/**
 * Collapse boxes when their header is clicked.
 * 
 * Also disallows tabbing into collapsed boxes and manages neat slide effects.
 * 
 * @exports Box
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  var Box;

  Box = {
    reset : function () {
      $('#tabs div.box.collapsed').removeClass('collapsed').css('height', '').css('transition', '');
    }
  };

  $(function ($) {

    function setTabbing ($box) {
      var i, $inputs, $input, enable;

      enable = !$box.hasClass('collapsed');

      $inputs = $box.find('a, button, input, select');

      for (i = 0; i < $inputs.length; i += 1) {
        $input = $inputs.eq(i);

        if (enable) {
          if ($input.data().tabindex === undefined) {
            $input.removeAttr('tabindex');
          } else {
            $input.attr('tabindex', $input.data().tabindex);
          }
          delete $input.data().tabindex;
        } else {
          $input.data().tabindex = $input.attr('tabindex');
          $input.attr('tabindex', -1);
        }
      }
    }

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

      setTabbing($box);

      // reset the transition value
      setTimeout(function () {
        $box.css('transition', '');
      }, 500);
    });

    // collapse all .box.collapsed boxes
    setTabbing($('div.box.collapsed').css('height', 0));
  });

  return Box;
});
