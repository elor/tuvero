/**
 * This object is intended to create and reference a Swisstournament singleton
 * 
 * @deprecated
 */
// TODO remove this whole file
define([ './tournaments' ], function (Tournaments) {
  return function () {
    return Tournaments.getTournament(0);
  };
});
