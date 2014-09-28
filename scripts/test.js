/**
* run all tests
* 
* this file is automatically created by updatetests.sh, located in the same folder. Do not attempt manual changes
*/

require([ 'common', 'lib/qunit', './backend/test/gameresultscorrection', './backend/test/kotournament', './backend/test/map', './backend/test/matrix', './backend/test/random', './backend/test/ranking', './backend/test/rleblobber', './backend/test/swisstournament', './backend/test/vector', './ui/test/blobs', './ui/test/csv', './ui/test/tab' ], function(Common, QUnit){
  QUnit.load();
  QUnit.start();
});
