/**
 * store the state whenever a player name changes
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['../state_new', '../listcollectormodel', '../teammodel', '../storage'],
    function(State, ListCollectorModel, TeamModel, Storage) {
      var teamCollector;

      // save on player name change
      teamCollector = new ListCollectorModel(State.teams, TeamModel);
      /**
       * overwrite the update listener: save whenever a team has been updated.
       *
       * Note to self: this also catches setID-fired events. Storage.store
       * should buffer multiple store() requests anyhow
       */
      teamCollector.onupdate = function() {
        Storage.store();
      };
    });
