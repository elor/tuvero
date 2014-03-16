/**
 * interface for creating a singular blob for data necessary to continue the
 * state in a different user session.
 */
define([ './team', './history', './swiss', './tab_teams', './tab_games',
    './tab_ranking', './tab_history' ], function (Team, History, Swiss,
    Tab_Teams, Tab_Games, Tab_Ranking, Tab_History) {
  var Blob;

  Blob = {
    /**
     * store the current program state in a blob
     * 
     * @returns the blob
     */
    toBlob : function () {
      return JSON.stringify({
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

      Team.fromBlob(ob.team);
      History.fromBlob(ob.history);
      Swiss.fromBlob(ob.swiss);

      // update all tabs
      Tab_Teams.updateBoxes();
      Tab_Games.reset();
      Tab_History.updateBoxes();

      Tab_Ranking.reset();
      Tab_Ranking.update(); // attempt ranking update

      return true;
    }
  };

  return Blob;
});
