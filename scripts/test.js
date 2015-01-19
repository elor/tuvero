/**
 * Run every available test
 *
 * This file is automatically created on build. Do not attempt manual changes
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'common', 'lib/qunit', './ui/interfaces/test/emitter', './ui/interfaces/test/model', './backend/test/gameresultscorrection', './backend/test/kotournament', './backend/test/map', './backend/test/matrix', './backend/test/random', './backend/test/ranking', './backend/test/rleblobber', './backend/test/swisstournament', './backend/test/vector', './ui/test/blobs', './ui/test/csv', './ui/test/listmodel', './ui/test/tab' ], function(Common, QUnit){
  var i;
  function myrequire (str) {
    return require.s.contexts._.defined[str];
  }
  for (i = 2; i < arguments.length; i += 1) {
    arguments[i](QUnit, myrequire);
  }
  QUnit.load();
  QUnit.start();
});
