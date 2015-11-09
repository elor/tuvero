/**
 * register and initiate static views, which aren't necessarily subviewed
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['../boxview', '../fontsizeview', '../staticviewloader', 'jquery'], //
function(BoxView, FontSizeView, StaticViewLoader, $) {
  $(function($) {
    StaticViewLoader.registerView('boxview', BoxView);
    StaticViewLoader.registerView('fontsizeview', FontSizeView);
    StaticViewLoader.loadViews($('body'));
  });

  return undefined;
});
