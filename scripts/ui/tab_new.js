/**
 * Tab_New handler
 */

define([], function () {
  var Tab_New, $tab;

  Tab_New = {};

  function init () {
    if ($tab) {
      console.error('tab_new: $tab already exists:');
      console.error($tab);
      return;
    }

    $tab = $('#new');
  }

  Tab_New.reset = function () {
    if (!$tab) {
      init();
    }
  };

  Tab_New.update = function () {
    // TODO do something
  };

  $('#new form').submit(function () {
    console.log($(this).find('input').val());
  });

  return Tab_New;
});
