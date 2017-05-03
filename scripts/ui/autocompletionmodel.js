/**
 * AutocompletionModel
 *
 * @return AutocompletionModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'jquery', 'core/type', './toast',
    'presets', './strings'], function(extend, Model, $, Type, Toast, Presets,
    Strings) {
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

    if (!url) {
      return;
    }

    $.get(url, undefined, function(jsontext, status, response) {
      autocomplete.parse(jsontext);
    }, 'text').fail(
        function() {
          console.error('could not read ' + Presets.names.playernameurl
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

        this.set(names);

        new Toast(Strings.autocompleteloaded);
      } catch (err) {
        console.error(err.stack);
        this.clear();
        new Toast(Strings.autocompletereloadfailed, Toast.LONG);
      }
    }
  };

  AutocompletionModel.prototype.set = function(names) {
    if (!Type.isArray(names)) {
      throw new Error('names is not an array');
    }

    this.clear();

    this.names = names.map(function(name) {
      return name.trim();
    });

    this.emit('update');
  };

  AutocompletionModel.prototype.clear = function() {
    this.names = [];
    this.emit('clear');
  };

  AutocompletionModel.prototype.save = function() {
    var data = AutocompletionModel.superclass.save.call(this);

    data.names = this.names.slice();

    return data;
  };

  AutocompletionModel.prototype.restore = function(data) {
    if (!AutocompletionModel.superclass.restore.call(this, data)) {
      return false;
    }

    this.set(data.names.slice());

    this.emit('update');

    return true;
  };

  AutocompletionModel.prototype.SAVEFORMAT = Object
      .create(AutocompletionModel.superclass.SAVEFORMAT);
  AutocompletionModel.prototype.SAVEFORMAT.names = [String];

  return AutocompletionModel;
});
