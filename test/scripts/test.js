/**
 * Run every available test
 *
 * This file is automatically created on build. Do not attempt manual changes
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
require(['config'], function() {
  require(['core/config'], function() {
    require(['core/common', 'qunit',
  'core/test/emitter',
  'core/test/trianglematrixmodel',
  'core/test/indexedmodel',
  'core/test/rankingheadtohead',
  'core/test/transposesummatrix',
  'core/test/positivematrix',
  'core/test/statevaluemodel',
  'core/test/rankingmodel',
  'core/test/propertymodel',
  'core/test/matrixmodel',
  'core/test/listmodel',
  'core/test/symmetricmatrixmodel',
  'core/test/transposedifferencematrix',
  'core/test/indexedlistmodel',
  'core/test/selectionvaluemodel',
  'core/test/absolutematrix',
  'core/test/vectormodel',
  'core/test/readonlylistmodel',
  'core/test/listupdatelistener',
  'core/test/rankingsonneborn',
  'core/test/delegatematrix',
  'core/test/valuemodel',
  'core/test/matchmodel',
  'core/test/antisymmetricmatrixmodel',
  'core/test/matchreferencemodel',
  'core/test/uniquelistmodel',
  'core/test/type',
  'core/test/rankingdatalistenerindex',
  'core/test/rankingcomponentindex',
  'core/test/rankingtac',
  'core/test/matchresult',
  'core/test/model',
  'backend/test/matrix',
  'backend/test/ranking',
  'backend/test/map',
  'backend/test/rleblobber',
  'backend/test/swisstournament',
  'backend/test/gameresultscorrection',
  'backend/test/vector',
  'backend/test/kotournament',
  'backend/test/random',

  'ui/test/tab',
  'ui/test/teammodel',
  'ui/test/blobs',
  'ui/test/listcollectormodel',
  'ui/test/playermodel',
  'ui/test/csv'
], function(Common, QUnit) {
          var i;
          for (i = 2; i < arguments.length; i += 1) {
            try {
              arguments[i](QUnit, Common);
            } catch (e) {
              QUnit.test('Loading Error', function() {
                var source = e.stack.split('\n')[2].replace(/^ *at */, '')
                  .replace(/\?bust=[0-9]*/, '');
                console.error(e.message);
                console.error(source);
                QUnit.ok(false, 'cannot load module ' +
                  e.message.match(/"[^"]+"/) + '. Possible typo?\n' +
                  source);
              });
            }
          }
          QUnit.load();
          QUnit.start();
        });
  });
});
