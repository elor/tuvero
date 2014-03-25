/**
 * Tab_New handler
 */

define([ './options', './tabshandle' ], function (Options, Tabshandle) {
  var Tab_New, $tab;

  Tab_New = {};

  function init () {
    if ($tab) {
      console.error('tab_new: $tab already exists:');
      console.error($tab);
      return;
    }

    $tab = $('#new');
    $tab.find('form input').val(Options.teamsize);

    $tab.find('form').on('load submit change', function (e) {
      var teamsize;

      teamsize = Number($(this).find('input').val());

      Options.teamsize = teamsize;

      Tabshandle.updateOpts();
      require('./alltabs').reset();
      require('./alltabs').update();

      e.preventDefault();

      return false;
    });
  }

  Tab_New.reset = function () {
    if (!$tab) {
      init();
    }
  };

  Tab_New.update = function () {
    // TODO do something
  };

  return Tab_New;
});
