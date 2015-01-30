/**
 * Autocomplete playernames using typeahead.js
 * 
 * @exports Autocomplete
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ './players', './shared', 'lib/typeahead' ], function (Players, Shared,
    undefined) {
  var Autocomplete, $fields;

  Autocomplete = {};

  $(function ($) {
    $fields = $('#teams input.playername');

    Autocomplete.clear = function () {
      $fields.typeahead('val', '');
    };

    Autocomplete.reset = function () {
      $fields.typeahead('destroy');
    };

    Autocomplete.update = function () {
      var names;

      Autocomplete.reset();

      names = Players.get();
      names = names.map(function (value) {
        return {
          val : value.trim()
        };
      });

      var states = new Bloodhound({
        datumTokenizer : Bloodhound.tokenizers.obj.whitespace('val'),
        queryTokenizer : Bloodhound.tokenizers.whitespace,
        local : names
      });

      states.initialize();

      $fields.typeahead({
        hint : true,
        highlight : true
      }, {
        name : 'names',
        displayKey : 'val',
        source : states.ttAdapter()
      });
    };

  });

  Shared.Autocomplete = Autocomplete;
  return Autocomplete;
});
