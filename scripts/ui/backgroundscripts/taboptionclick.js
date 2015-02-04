/**
 * When a user clicks a tab option text, delegate the click to the associated
 * input element
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {

  $(function($) {
    $('#tabs').on('click', '> div > div.options span', function(e) {
      if ($(e.target).prop('tagName') === 'SPAN') {
        $(this).find('input').eq(0).click();
      }
    });
  });

  return undefined;
});
