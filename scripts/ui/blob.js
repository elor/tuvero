/**
 * interface for creating a singular blob for data necessary to continue the
 * state in a different user session.
 */
define([ './options', './tabshandle', './team', './history', './swiss',
    './tab_teams', './tab_games', './tab_ranking', './tab_history', './tab_new' ], function (Options, Tabshandle, Team, History, Swiss, Tab_Teams, Tab_Games, Tab_Ranking, Tab_History, Tab_New) {
  var Blob;

  Blob = {
    /**
     * store the current program state in a blob
     * 
     * @returns the blob
     */
    toBlob : function () {
      return JSON.stringify({
        options : Options.toBlob(),
        team : Team.toBlob(),
        history : History.toBlob(),
        swiss : Swiss.toBlob()
      });
    },

    /**
     * restore the program state from the blob
     * 
     * @param blob
     *          the blob
     */
    fromBlob : function (blob) {
      var ob;

      if (!blob) {
        return undefined;
      }

      ob = JSON.parse(blob);

      // fall back to default options when loading saves from before 1.2
      if (ob.options) {
        Options.fromBlob(ob.options);
        Tabshandle.updateOpts();
      }

      Team.fromBlob(ob.team);
      History.fromBlob(ob.history);
      Swiss.fromBlob(ob.swiss);

      // update all tabs
      Tab_Teams.update();
      Tab_New.update();
      Tab_Games.update();
      Tab_History.update();
      Tab_Ranking.update(); // attempt ranking update

      return true;
    },

    /**
     * resets everything managed by Blob
     */
    reset : function () {
      Team.reset();
      History.reset();
      Swiss.reset();
      Options.reset();
      Tabshandle.updateOpts();
    },
  };

  return Blob;
});
