/**
 * AutocompletionModel
 *
 * @return AutocompletionModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'jquery', 'core/type', './toast',
    './strings'], function(extend, Model, $, Type, Toast, Strings) {
  /**
   * Constructor
   */
  function AutocompletionModel() {
    AutocompletionModel.superconstructor.call(this);

    this.names = [];
  }
  extend(AutocompletionModel, Model);

  AutocompletionModel.prototype.EVENTS = {
    clear: true,
    update: true
  };

  AutocompletionModel.prototype.download = function(url) {
    var autocomplete = this;

    $.get(url, undefined, function(jsontext, status, response) {
      autocomplete.parse(jsontext);
    }, 'text').fail(
        function() {
          console.error('could not read ' + Options.playernameurl
              + '. Is this a local installation?');
          new Toast(Strings.autocompletereloadfailed, Toast.LONG);
        });
  };

  AutocompletionModel.prototype.parse = function(text) {
    var names;

    if (text.length === 0) {
      new Toast(Strings.fileempty);
    } else {
      try {
        names = JSON.parse(text);

        if (!Type.isArray(names)) {
          throw new Error('names is not an array');
        }

        this.names = names.map(function(name) {
          return name.trim();
        });

        this.emit('update');

        new Toast(Strings.autocompleteloaded);
      } catch (err) {
        console.error(err.stack);
        this.clear();
        new Toast(Strings.autocompletereloadfailed, Toast.LONG);
      }
    }
  };

  AutocompletionModel.prototype.clear = function() {
    this.names = [];
    this.emit('clear');
  };

  return AutocompletionModel;
});
