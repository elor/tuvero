/**
 * AutocompletionView
 *
 * @return AutocompletionView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'lib/typeahead'], function(extend, View,
    typeahead) {
  /**
   * Constructor
   */
  function AutocompletionView(model, $view) {
    AutocompletionView.superconstructor.call(this, model, $view);

    this.update();
  }
  extend(AutocompletionView, View);

  AutocompletionView.prototype.update = function() {
    var states;

    this.reset();

    if (this.model.names.length === 0) {
      return;
    }

    states = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('val'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: this.model.names.map(this.stringToBloodhoundObject)
    });

    states.initialize();

    this.$view.typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    }, {
      name: 'names',
      displayKey: 'val',
      source: states.ttAdapter()
    });
  };

  AutocompletionView.prototype.onupdate = function() {
    this.update();
  };

  AutocompletionView.prototype.onclear = function() {
    this.$view.typeahead('val', '');
  };

  AutocompletionView.prototype.reset = function() {
    this.$view.typeahead('destroy');
  };

  AutocompletionView.prototype.stringToBloodhoundObject = function(string) {
    return {
      val: string
    };
  };

  AutocompletionView.prototype.destroy = function() {
    AutocompletionView.superclass.destroy.call(this);

    this.reset();
  };

  return AutocompletionView;
});
