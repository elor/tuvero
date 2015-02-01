/**
 * A TemplateView holds a template element from the DOM, which it prepares for
 * duplication through a subclass, e.g. ListView. Templating is not meant to be
 * handled by the user.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 * @return TemplateView
 */
define(['lib/extend', './view'], function(extend, View) {

  /**
   * @param model
   *          the model
   * @param $view
   *          the view DOM element
   * @param $template
   *          the template
   */
  function TemplateView(model, $view, $template) {
    TemplateView.superconstructor.call(this, model, $view);
    this.$template = $template.detach().removeClass('template');
  }
  extend(TemplateView, View);

  return TemplateView;
});
