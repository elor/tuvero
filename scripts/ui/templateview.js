/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './view'], function() {
function TemplateView(model, $view, $template){
  TemplateView.superconstructor.call(this, model, $view);
  this.$template = $template.detach().removeClass('template');
}
});
