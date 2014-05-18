/**
 * Tab_New handler
 */

define([ './options', './tabshandle', './team', './opts' ], function (Options, Tabshandle, Team, Opts) {
  var Tab_New, $tab, options;

  Tab_New = {};
  options = {};

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

  Tab_New.getOptions = function () {
    return Opts.getOptions({
      options : options
    });
  };

  Tab_New.setOptions = function (opts) {
    return Opts.setOptions({
      options : options
    }, opts);
  };

  return Tab_New;
});
