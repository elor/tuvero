/**
 * Tab_New handler
 */

define([ './options', './tabshandle', './team', './opts' ], function (Options, Tabshandle, Team, Opts) {
  var Tab_New, $tab, $teamsize, options;

  Tab_New = {};
  options = {};

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
    Tab_New.reset();

    if (Team.count() === 0) {
      Tabshandle.show('new');
    } else {
      Tabshandle.show('new');
//      Tabshandle.hide('new');
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
