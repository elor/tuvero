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

  'backend/test/matrix',
  'backend/test/ranking',
  'backend/test/map',
  'backend/test/rleblobber',
  'backend/test/swisstournament',
  'backend/test/gameresultscorrection',
  'backend/test/vector',
  'backend/test/kotournament',
  'backend/test/random',

  'ui/test/emitter',
  'ui/test/indexedmodel',
  'ui/test/tab',
  'ui/test/teammodel',
  'ui/test/blobs',
  'ui/test/listmodel',
  'ui/test/indexedlistmodel',
  'ui/test/listcollectormodel',
  'ui/test/valuemodel',
  'ui/test/playermodel',
  'ui/test/csv',
  'ui/test/model',
], function(Common, QUnit) {
          var i;
          for (i = 2; i < arguments.length; i += 1) {
            arguments[i](QUnit, Common);
          }
          QUnit.load();
          QUnit.start();
        });
  });
});
