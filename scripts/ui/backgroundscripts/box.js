/**
 * create BoxViews for every div.box
 * 
 * TODO remove this file in favor of subviewed boxes
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ '../boxview' ], function (BoxView) {
  $(function ($) {
    $('#tabs div.box').each(function (e) {
      var $box, view;

      $box = $(this);
      view = new BoxView($box, $box.hasClass('collapsed'));
    });
  });
});
