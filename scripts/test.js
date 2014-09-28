/**
 * run all tests
 * 
 * this file is automatically created by updatetests.sh, located in the same
 * folder. Do not attempt manual changes
 */

require([ 'common', 'lib/qunit', './backend/test/gameresultscorrection',
    './backend/test/kotournament', './backend/test/map',
    './backend/test/matrix', './backend/test/random', './backend/test/ranking',
    './backend/test/rleblobber', './backend/test/swisstournament',
    './backend/test/vector', './ui/test/blobs', './ui/test/csv',
    './ui/test/tab' ], function (Common, QUnit) {
  var i;

  function myrequire (str) {
    console.log(str);
    return require.s.contexts._.defined[str];
  }

  for (i = 2; i < arguments.length; i += 1) {
    arguments[i](QUnit, myrequire);
  }
  QUnit.load();
  QUnit.start();
});
