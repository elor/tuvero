/**
 * Tab_New handler
 */

define([], function () {
  var Tab_New;

  Tab_New = {};

  Tab_New.reset = function () {
    // TODO do something
  };

  Tab_New.update = function () {
    // TODO do something
  };

  $('#new form').submit(function () {
    console.log($(this).find('input').val());
  });

  return Tab_New;
});
