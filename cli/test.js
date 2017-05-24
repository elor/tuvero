#!/usr/bin/env node

"use strict";

var fs = require('fs');
var requirejs = require('requirejs');
var QUnit = require('qunitjs');

var tests = ['core/test/byeresult',
    'core/test/correctionmodel',
    'core/test/correctionreferencemodel',
    'core/test/emitter',
    'core/test/listener',
    'core/test/matchmodel',
    'core/test/matchreferencemodel',
    'core/test/matchresult',
    'core/test/model',
    'core/test/propertymodel',
    'core/test/propertyvaluemodel',
    'core/test/random',
    'core/test/resultreferencemodel',
    'core/test/rle',
    'core/test/selectionvaluemodel',
    'core/test/statevaluemodel',
    'core/test/type',
    'core/test/valuemodel',
    'list/test/binningreferencelistmodel',
    'list/test/combinedreferencelistmodel',
    'list/test/indexedlistmodel',
    'list/test/indexedmodel',
    'list/test/lengthmodel',
    'list/test/listmodel',
    'list/test/listupdatelistener',
    'list/test/maplistmodel',
    'list/test/orderlistmodel',
    'list/test/readonlylistmodel',
    'list/test/referencelistmodel',
    'list/test/sortedreferencelistmodel',
    'list/test/uniquelistmodel',
    'math/test/absolutematrix',
    'math/test/antisymmetricmatrixmodel',
    'math/test/delegatematrix',
    'math/test/matrixmodel',
    'math/test/positivematrix',
    'math/test/symmetricmatrixmodel',
    'math/test/transposedifferencematrix',
    'math/test/transposesummatrix',
    'math/test/trianglematrixmodel',
    'math/test/vectormodel',
    'ranking/test/rankingcomponentindex',
    'ranking/test/rankingdatalistenerindex',
    'ranking/test/rankingheadtohead',
    'ranking/test/rankingmapper',
    'ranking/test/rankingmodel',
    'ranking/test/rankingsonneborn',
    'ranking/test/rankingtac',
    'timemachine/test/keymodel',
    'timemachine/test/query',
    'tournament/test/kotournamentmodel',
    'tournament/test/roundtournamentmodel',
    'tournament/test/swisstournamentmodel',
    'tournament/test/tournamentindex',
    'tournament/test/tournamentlistmodel',
    'tournament/test/tournamentmodel',
    //'ui/test/binarytreemodel',
    //'ui/test/listcollectormodel',
    //'ui/test/playermodel',
    //'ui/test/teammodel',
    //'ui/test/teamsfileloadcontroller'
];

requirejs.config({
    baseUrl: '../scripts'
});

requirejs(['core/config'], function (config) {
    var myBase = '../test/scripts/';

    requirejs.config({
        paths: {
            'options': myBase + 'options',
            'presets': myBase + 'presets',
            'strings': myBase + 'strings'
        }
    });

    QUnit.testStart(function (test) {
        console.log("testStart");
        //console.log(test);
    });

    QUnit.log(function (test) {
        if (!test.result) {
            console.log(test.message);
            delete test.message;
            console.log(test);
        }
    });

    QUnit.testDone(function (test) {
        console.log("testDone");
        //console.log(test);
    });

    QUnit.done(function (data) {
        console.log("done");
        console.log(data);
    });

    tests.forEach(test => requirejs(test)(QUnit, requirejs));

    QUnit.load();
});
