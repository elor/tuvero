/**
 * register and initiate static views, which aren't necessarily subviewed
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import BoxView from '../ui/boxview.js';
import $ from 'jquery';
var InitViews;
$(function ($) {
  $('.boxview:not(.template)').each(function () {
    var $box;
    $box = $(this);
    if ($box.parents('.template').length === 0) {
      return new BoxView($box);
    }
  });
});
export default InitViews;