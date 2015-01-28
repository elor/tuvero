# scripts/common.js


common.js: loads each requirejs-compatible script file (except tests) and
configures requirejs to load libraries as shims

This file is automatically generated as part of the build process.
Do not attempt manual changes
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="backend/blobber.html">backend/blobber</a>
* <a href="backend/buchholzranking.html">backend/buchholzranking</a>
* <a href="backend/correction.html">backend/correction</a>
* <a href="backend/finebuchholzranking.html">backend/finebuchholzranking</a>
* <a href="backend/fullmatrix.html">backend/fullmatrix</a>
* <a href="backend/game.html">backend/game</a>
* <a href="backend/halfmatrix.html">backend/halfmatrix</a>
* <a href="backend/kotournament.html">backend/kotournament</a>
* <a href="backend/map.html">backend/map</a>
* <a href="backend/matrix.html">backend/matrix</a>
* <a href="backend/nettoranking.html">backend/nettoranking</a>
* <a href="backend/options.html">backend/options</a>
* <a href="backend/random.html">backend/random</a>
* <a href="backend/ranking.html">backend/ranking</a>
* <a href="backend/result.html">backend/result</a>
* <a href="backend/rleblobber.html">backend/rleblobber</a>
* <a href="backend/swisstournament.html">backend/swisstournament</a>
* <a href="backend/tournament.html">backend/tournament</a>
* <a href="backend/vector.html">backend/vector</a>
* lib/extend
* lib/FileSaver
* lib/implements
* <a href="ui/alltabs.html">ui/alltabs</a>
* <a href="ui/autocomplete.html">ui/autocomplete</a>
* <a href="ui/backgroundscripts/featuredetect.html">ui/backgroundscripts/featuredetect</a>
* <a href="ui/backgroundscripts/initviews.html">ui/backgroundscripts/initviews</a>
* <a href="ui/backgroundscripts/online.html">ui/backgroundscripts/online</a>
* <a href="ui/backgroundscripts/print.html">ui/backgroundscripts/print</a>
* <a href="ui/backgroundscripts/reset.html">ui/backgroundscripts/reset</a>
* <a href="ui/backgroundscripts/save.html">ui/backgroundscripts/save</a>
* <a href="ui/backgroundscripts/updatetab.html">ui/backgroundscripts/updatetab</a>
* <a href="ui/boxcontroller.html">ui/boxcontroller</a>
* <a href="ui/boxview.html">ui/boxview</a>
* <a href="ui/csver.html">ui/csver</a>
* <a href="ui/data/swissperms.html">ui/data/swissperms</a>
* <a href="ui/debug.html">ui/debug</a>
* <a href="ui/fontsizecontroller.html">ui/fontsizecontroller</a>
* <a href="ui/fontsizemodel.html">ui/fontsizemodel</a>
* <a href="ui/fontsizeview.html">ui/fontsizeview</a>
* <a href="ui/globalranking.html">ui/globalranking</a>
* <a href="ui/history.html">ui/history</a>
* <a href="ui/indexedlistmodel.html">ui/indexedlistmodel</a>
* <a href="ui/indexedmodel.html">ui/indexedmodel</a>
* <a href="ui/interfaces/controller.html">ui/interfaces/controller</a>
* <a href="ui/interfaces/emitter.html">ui/interfaces/emitter</a>
* <a href="ui/interfaces/model.html">ui/interfaces/model</a>
* <a href="ui/interfaces/view.html">ui/interfaces/view</a>
* <a href="ui/koline.html">ui/koline</a>
* <a href="ui/listmodel.html">ui/listmodel</a>
* <a href="ui/listview.html">ui/listview</a>
* <a href="ui/options.html">ui/options</a>
* <a href="ui/opts.html">ui/opts</a>
* <a href="ui/playermodel.html">ui/playermodel</a>
* <a href="ui/players.html">ui/players</a>
* <a href="ui/ranking.html">ui/ranking</a>
* <a href="ui/shared.html">ui/shared</a>
* <a href="ui/splash.html">ui/splash</a>
* <a href="ui/state.html">ui/state</a>
* <a href="ui/statemodel.html">ui/statemodel</a>
* <a href="ui/state_new.html">ui/state_new</a>
* <a href="ui/staticviewloader.html">ui/staticviewloader</a>
* <a href="ui/storage.html">ui/storage</a>
* <a href="ui/strings.html">ui/strings</a>
* <a href="ui/tab.html">ui/tab</a>
* <a href="ui/tab_debug.html">ui/tab_debug</a>
* <a href="ui/tab_games.html">ui/tab_games</a>
* <a href="ui/tab_history.html">ui/tab_history</a>
* <a href="ui/tablemodel.html">ui/tablemodel</a>
* <a href="ui/tableview.html">ui/tableview</a>
* <a href="ui/tab_new.html">ui/tab_new</a>
* <a href="ui/tab_ranking.html">ui/tab_ranking</a>
* <a href="ui/tabs.html">ui/tabs</a>
* <a href="ui/tab_settings.html">ui/tab_settings</a>
* <a href="ui/tabshandle.html">ui/tabshandle</a>
* <a href="ui/tab_teams.html">ui/tab_teams</a>
* <a href="ui/team.html">ui/team</a>
* <a href="ui/teammodel.html">ui/teammodel</a>
* <a href="ui/teamview.html">ui/teamview</a>
* <a href="ui/textview.html">ui/textview</a>
* <a href="ui/toast.html">ui/toast</a>
* <a href="ui/tournaments.html">ui/tournaments</a>
* <a href="ui/type.html">ui/type</a>
* <a href="ui/update.html">ui/update</a>

## Functions

###       init: function()
disable QUnit autoload/autostart for requirejs optimizer compatibility

---

## Metrics

* 126 Lines
* 2679 Bytes
