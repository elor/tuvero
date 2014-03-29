/**
 * Tab_New handler
 */

define([ './options', './tabshandle', './team' ], function (Options, Tabshandle, Team) {
  var Tab_New, $tab;

  Tab_New = {};

  function initTeamSize () {
    $tab.find('button').on('click', function (e) {
      var teamsize, $button;

      $button = $(this);

      if ($button.prop('tagName') === 'IMG') {
        $button = $button.parent();
      }

      teamsize = Number($button.val());

      Options.teamsize = teamsize;

      Tabshandle.updateOpts();
      require('./alltabs').reset();
      require('./alltabs').update();

      e.preventDefault();

      return false;
    });
  }

  function updateTeamSize () {
    $tab.find('form button').removeClass('selected');
    $tab.find('form button[value=' + Options.teamsize + ']').addClass('selected');
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

    if (Team.count() === 0) {
      Tabshandle.show('new');
    } else {
      Tabshandle.hide('new');
    }
  };

  return Tab_New;
});
