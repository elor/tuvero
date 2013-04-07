/**
 * This object is intended to create and reference a Swisstournament singleton
 */
define([ '../backend/swisstournament' ], function (Swisstournament) {
  var Swiss;

  Swiss = new Swisstournament();

  return Swiss;
});
