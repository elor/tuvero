/**
 * common.js: loads each requirejs-compatible script file
 *
 * This file is automatically generated as part of the build process.
 * Do not attempt manual changes, they'll be overwritten
 *
 * @return Common
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([
  'timemachine/commitmodel',
  'timemachine/keymodel',
  'timemachine/query',
  'timemachine/reflog',
  'timemachine/timemachine',
  'lib/Blob',
  'lib/diff',
  'lib/extend',
  'lib/FileSaver',
  'lib/jquery',
  'lib/modernizr',
  'lib/typeahead',
  'background/autosave',
  'background/dropstyle',
  'background/featuredetect',
  'background/fonthotkeys',
  'background/initboxviews',
  'background/matchtoasts',
  'background/online',
  'background/print',
  'background/reset',
  'background/save',
  'background/statetoasts',
  'background/tournamenterrortoasts',
  'core/absolutematrix',
  'core/antisymmetricmatrixmodel',
  'core/binningreferencelistmodel',
  'core/byeresult',
  'core/classview',
  'core/combinedreferencelistmodel',
  'core/controller',
  'core/correctionmodel',
  'core/correctionreferencemodel',
  'core/delegatematrix',
  'core/emitter',
  'core/indexedlistmodel',
  'core/indexedmodel',
  'core/kotournamentmodel',
  'core/lengthmodel',
  'core/listener',
  'core/listexclusionlistener',
  'core/listmodel',
  'core/listupdatelistener',
  'core/maplistmodel',
  'core/matchmodel',
  'core/matchreferencemodel',
  'core/matchresult',
  'core/matrixmodel',
  'core/model',
  'core/orderlistmodel',
  'core/positivematrix',
  'core/propertymodel',
  'core/propertyvaluemodel',
  'core/random',
  'core/rankingbuchholzcomponent',
  'core/rankingbuchholzlistener',
  'core/rankingbyelistener',
  'core/rankingcomponent',
  'core/rankingcomponentindex',
  'core/rankingdatalistener',
  'core/rankingdatalistenerindex',
  'core/rankingdownvoteslistener',
  'core/rankingfinebuchholzcomponent',
  'core/rankingfinebuchholzlistener',
  'core/rankinggamematrixlistener',
  'core/rankingheadtoheadcomponent',
  'core/rankingheadtoheadlistener',
  'core/rankingidcomponent',
  'core/rankingkocomponent',
  'core/rankingkolistener',
  'core/rankinglostpointscomponent',
  'core/rankinglostpointslistener',
  'core/rankingmapper',
  'core/rankingmodel',
  'core/rankingnumgamescomponent',
  'core/rankingnumgameslistener',
  'core/rankingpointscomponent',
  'core/rankingpointslistener',
  'core/rankingsaldocomponent',
  'core/rankingsaldolistener',
  'core/rankingsonneborncomponent',
  'core/rankingsonnebornlistener',
  'core/rankingtaccomponent',
  'core/rankingtaclistener',
  'core/rankingupvoteslistener',
  'core/rankingvotescomponent',
  'core/rankingvoteslistener',
  'core/rankingwinscomponent',
  'core/rankingwinslistener',
  'core/rankingwinsmatrixlistener',
  'core/readonlylistmodel',
  'core/referencelistmodel',
  'core/resultreferencemodel',
  'core/rle',
  'core/roundtournamentmodel',
  'core/selectionvaluemodel',
  'core/sortedreferencelistmodel',
  'core/statevaluemodel',
  'core/swisstournamentmodel',
  'core/symmetricmatrixmodel',
  'core/tabimageview',
  'core/tabmenucontroller',
  'core/tabmenuview',
  'core/tabmodel',
  'core/tournamentindex',
  'core/tournamentlistmodel',
  'core/tournamentmodel',
  'core/transposedifferencematrix',
  'core/transposesummatrix',
  'core/trianglematrixmodel',
  'core/type',
  'core/uniquelistmodel',
  'core/valuemodel',
  'core/vectormodel',
  'core/view',
  'ui/attributevalueview',
  'ui/autocompletionmodel',
  'ui/autocompletionview',
  'ui/binarytreemodel',
  'ui/boxcontroller',
  'ui/boxview',
  'ui/browser',
  'ui/browserinfocontroller',
  'ui/browserinfoview',
  'ui/checkboxcontroller',
  'ui/checkboxview',
  'ui/closedtournamentcollapselistener',
  'ui/correctionview',
  'ui/csvexportcontroller',
  'ui/debug',
  'ui/debugtab',
  'ui/deleteallteamscontroller',
  'ui/fileloadcontroller',
  'ui/filesavermodel',
  'ui/finishroundcontroller',
  'ui/fontsizecontroller',
  'ui/fontsizemodel',
  'ui/fontsizeview',
  'ui/gamestab',
  'ui/generictournamenthistoryview',
  'ui/generictournamentview',
  'ui/historytab',
  'ui/hometab',
  'ui/imageview',
  'ui/inlinelistview',
  'ui/inputview',
  'ui/kohistoryview',
  'ui/koline',
  'ui/kolineview',
  'ui/kolistmodel',
  'ui/komatchresultview',
  'ui/kotournamentcontroller',
  'ui/kotournamentview',
  'ui/kotreeposition',
  'ui/kotreeview',
  'ui/legacyloadermodel',
  'ui/legacystoragekeyconverter',
  'ui/lengthview',
  'ui/listcleanuplistener',
  'ui/listclickcontroller',
  'ui/listcollectormodel',
  'ui/listview',
  'ui/loadedimagesview',
  'ui/logincontroller',
  'ui/loginview',
  'ui/matchcontroller',
  'ui/matchresultcontroller',
  'ui/matchresultview',
  'ui/matchtableview',
  'ui/matchview',
  'ui/messagemodel',
  'ui/newtab',
  'ui/newteamcontroller',
  'ui/newteamview',
  'ui/newtournamentcontroller',
  'ui/newtournamentview',
  'ui/noregmodel',
  'ui/optionstemplate',
  'ui/playermodel',
  'ui/popoutboxview',
  'ui/popoutcontroller',
  'ui/preregcloserview',
  'ui/progresslistmodel',
  'ui/progressroundview',
  'ui/progressrowview',
  'ui/progresstableview',
  'ui/rankingcomponentview',
  'ui/rankingordercontroller',
  'ui/rankingorderview',
  'ui/rankingtab',
  'ui/rankingview',
  'ui/registeridscontroller',
  'ui/registerteamscontroller',
  'ui/renamecontroller',
  'ui/requiremodsshortcut',
  'ui/reversematchreferencemodel',
  'ui/reverseresultreferencemodel',
  'ui/roundtournamentview',
  'ui/serverautoloadmodel',
  'ui/servermodel',
  'ui/servertournamentcontroller',
  'ui/servertournamentlistmodel',
  'ui/servertournamentloader',
  'ui/servertournamentmodel',
  'ui/servertournamentview',
  'ui/settingstab',
  'ui/splash',
  'ui/state',
  'ui/stateclassview',
  'ui/statefileloadcontroller',
  'ui/stateloader',
  'ui/statemodel',
  'ui/statesaver',
  'ui/storage',
  'ui/strings',
  'ui/swissmaxroundview',
  'ui/swisstournamentcontroller',
  'ui/swisstournamentview',
  'ui/swissvotepropcontroller',
  'ui/swissvotepropview',
  'ui/swissvotesview',
  'ui/systemlistview',
  'ui/systemtablerowview',
  'ui/tabshandle',
  'ui/teamcontroller',
  'ui/teamdeletecontroller',
  'ui/teamformatdownloadcontroller',
  'ui/teammodel',
  'ui/teamsfileloadcontroller',
  'ui/teamsizecontroller',
  'ui/teamsizeview',
  'ui/teamstab',
  'ui/teamtableview',
  'ui/teamtoastslistener',
  'ui/teamview',
  'ui/templateview',
  'ui/textview',
  'ui/timemachinecommitcontroller',
  'ui/timemachinecommitview',
  'ui/timemachinenewtreecontroller',
  'ui/timemachineview',
  'ui/toast',
  'ui/tournamentcontroller',
  'ui/tournamenthistoryview',
  'ui/tournamentmatchesview',
  'ui/tournamentrankingview',
  'ui/tournamentrenamecontroller',
  'ui/tournamentview',
  'ui/tournamentviewpopulator',
  'ui/unicodehelper',
  'ui/update',
  'ui/valueview'
], function (undefined) {
    var Common = function (str) {
        var module = require.s.contexts._.defined[str];
        if (!module) {
            throw new Error("module" + str + " is undefined, not loaded or equals 0 in some way => " + module);
            }
        return module;
    };

    return Common;
});
