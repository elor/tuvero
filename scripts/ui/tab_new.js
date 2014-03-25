/**
 * Tab_New handler
 */

define([ './options', './tabshandle' ], function (Options, Tabshandle) {
  var Tab_New, $tab;

  Tab_New = {};

  function initTeamSize () {
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

  function updateTeamSize () {
    $tab.find('form input').val(Options.teamsize);
  }
  function init () {
    if ($tab) {
      console.error('tab_new: $tab already exists:');
      console.error($tab);
      return;
    }

    $tab = $('#new');

    initTeamSize();
  }

  Tab_New.reset = function () {
    if (!$tab) {
      init();
    }

    updateTeamSize();
  };

  Tab_New.update = function () {
    Tab_New.reset();
  };

  return Tab_New;
});
