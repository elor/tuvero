import View from '../core/view.js'

/**
 * @param model
 *          the model
 * @param $view
 *          the view DOM element
 * @param $template
 *          the template
 */
class TemplateView extends View {
  constructor (model, $view, $template) {
    super(model, $view)
    this.$template = $template.detach().removeClass('template')
  }
}

export default TemplateView
