/**
 * common.js: loads each requirejs-compatible script file (except tests)
 *
 * This file is automatically generated as part of the build process.
 * Do not attempt manual changes
 *
 * @return Common
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([
  'core/absolutematrix',
  'core/antisymmetricmatrixmodel',
  'core/classview',
  'core/controller',
  'core/correctionmodel',
  'core/correctionreferencemodel',
  'core/delegatematrix',
  'core/emitter',
  'core/indexedlistmodel',
  'core/indexedmodel',
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
  'core/rankingbuchholzcomponent',
  'core/rankingbuchholzlistener',
  'core/rankingcomponentindex',
  'core/rankingcomponent',
  'core/rankingdatalistenerindex',
  'core/rankingdatalistener',
  'core/rankingfinebuchholzcomponent',
  'core/rankingfinebuchholzlistener',
  'core/rankinggamematrixlistener',
  'core/rankingheadtoheadcomponent',
  'core/rankingheadtoheadmatrixlistener',
  'core/rankingidcomponent',
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
  'core/rankingwinscomponent',
  'core/rankingwinslistener',
  'core/rankingwinsmatrixlistener',
  'core/readonlylistmodel',
  'core/referencelistmodel',
  'core/resultreferencemodel',
  'core/rle',
  'core/roundtournamentmodel',
  'core/selectionvaluemodel',
  'core/statevaluemodel',
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
  'backend/blobber',
  'backend/buchholzranking',
  'backend/correction',
  'backend/finebuchholzranking',
  'backend/fullmatrix',
  'backend/game',
  'backend/halfmatrix',
  'backend/kotournament',
  'backend/map',
  'backend/matrix',
  'backend/nettoranking',
  'backend/options',
  'backend/random',
  'backend/ranking',
  'backend/result',
  'backend/rleblobber',
  'backend/swisstournament',
  'backend/tournament',
  'backend/vector',
  'lib/Blob',
  'lib/diff',
  'lib/extend',
  'lib/FileSaver',
  'lib/implements',
  'lib/jquery',
  'lib/modernizr',
  'lib/typeahead',
  'ui/alltabs',
  'ui/autocomplete',
  'ui/backgroundscripts/reset',
  'ui/backgroundscripts/featuredetect',
  'ui/backgroundscripts/updatetab',
  'ui/backgroundscripts/tabnewcheaphacklistener',
  'ui/backgroundscripts/online',
  'ui/backgroundscripts/save',
  'ui/backgroundscripts/redrawOnPlayerChange',
  'ui/backgroundscripts/load',
  'ui/backgroundscripts/print',
  'ui/backgroundscripts/taboptionclick',
  'ui/backgroundscripts/initviews',
  'ui/binarytreemodel',
  'ui/boxcontroller',
  'ui/boxview',
  'ui/checkboxcontroller',
  'ui/checkboxview',
  'ui/csver',
  'ui/data/swissperms',
  'ui/debug',
  'ui/fontsizecontroller',
  'ui/fontsizemodel',
  'ui/fontsizeview',
  'ui/globalranking',
  'ui/history',
  'ui/inputview',
  'ui/koline',
  'ui/lengthview',
  'ui/listcleanuplistener',
  'ui/listclickcontroller',
  'ui/listcollectormodel',
  'ui/listview',
  'ui/matchcontroller',
  'ui/matchview',
  'ui/newtab',
  'ui/newteamcontroller',
  'ui/newteamview',
  'ui/options',
  'ui/opts',
  'ui/playermodel',
  'ui/players',
  'ui/preregcloserview',
  'ui/rankingcomponentview',
  'ui/ranking',
  'ui/rankingordercontroller',
  'ui/rankingorderview',
  'ui/rankingview',
  'ui/savestate',
  'ui/shared',
  'ui/splash',
  'ui/stateclassview',
  'ui/state',
  'ui/statemodel',
  'ui/state_new',
  'ui/staticviewloader',
  'ui/storage',
  'ui/strings',
  'ui/systemlistview',
  'ui/systemtablerowview',
  'ui/tab_debug',
  'ui/tab_games',
  'ui/tab_history',
  'ui/tab',
  'ui/tablemodel',
  'ui/tableview',
  'ui/tab_new',
  'ui/tab_ranking',
  'ui/tab_settings',
  'ui/tabshandle',
  'ui/team',
  'ui/teammodel',
  'ui/teamnamecontroller',
  'ui/teamremovecontroller',
  'ui/teamsfileloadcontroller',
  'ui/teamsizecontroller',
  'ui/teamsizeview',
  'ui/teamstab',
  'ui/teamtableview',
  'ui/teamtoastslistener',
  'ui/teamview',
  'ui/templateview',
  'ui/textview',
  'ui/toast',
  'ui/tournaments',
  'ui/tournamentview',
  'ui/treenode',
  'ui/update',
  'ui/valueview'
], function(undefined) {
  return function(str) {
    var module = require.s.contexts._.defined[str];
    if (!module) {
      throw new Error('module "' + str +
        '" is undefined, not loaded or equals 0 in some way => ' + module);
    }
    return module;
  };
});
