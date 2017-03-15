/**
 * Run every available test
 *
 * This file is automatically created on build. Do not attempt manual changes
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
require(['config'], function () {
    require(['core/config'], function () {
        require(['core/common', 'qunit',
              'core/test/absolutematrix',
  'core/test/antisymmetricmatrixmodel',
  'core/test/binningreferencelistmodel',
  'core/test/byeresult',
  'core/test/combinedreferencelistmodel',
  'core/test/correctionmodel',
  'core/test/correctionreferencemodel',
  'core/test/delegatematrix',
  'core/test/emitter',
  'core/test/indexedlistmodel',
  'core/test/indexedmodel',
  'core/test/kotournamentmodel',
  'core/test/lengthmodel',
  'core/test/listener',
  'core/test/listmodel',
  'core/test/listupdatelistener',
  'core/test/maplistmodel',
  'core/test/matchmodel',
  'core/test/matchreferencemodel',
  'core/test/matchresult',
  'core/test/matrixmodel',
  'core/test/model',
  'core/test/orderlistmodel',
  'core/test/positivematrix',
  'core/test/propertymodel',
  'core/test/propertyvaluemodel',
  'core/test/random',
  'core/test/rankingcomponentindex',
  'core/test/rankingdatalistenerindex',
  'core/test/rankingheadtohead',
  'core/test/rankingmapper',
  'core/test/rankingmodel',
  'core/test/rankingsonneborn',
  'core/test/rankingtac',
  'core/test/readonlylistmodel',
  'core/test/referencelistmodel',
  'core/test/resultreferencemodel',
  'core/test/rle',
  'core/test/roundtournamentmodel',
  'core/test/selectionvaluemodel',
  'core/test/sortedreferencelistmodel',
  'core/test/statevaluemodel',
  'core/test/swisstournamentmodel',
  'core/test/symmetricmatrixmodel',
  'core/test/tournamentindex',
  'core/test/tournamentlistmodel',
  'core/test/tournamentmodel',
  'core/test/transposedifferencematrix',
  'core/test/transposesummatrix',
  'core/test/trianglematrixmodel',
  'core/test/type',
  'core/test/uniquelistmodel',
  'core/test/valuemodel',
  'core/test/vectormodel',
  'timemachine/test/keymodel',
  'timemachine/test/query',
  'ui/test/binarytreemodel',
  'ui/test/listcollectormodel',
  'ui/test/playermodel',
  'ui/test/teammodel',
  'ui/test/teamsfileloadcontroller'
        ], function (Common, QUnit) {
            var i;
            for (i = 2; i < arguments.length; i += 1) {
                try {
                    arguments[i](QUnit, Common);
                } catch (e) {
                    QUnit.test('Loading Error', function () {
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
