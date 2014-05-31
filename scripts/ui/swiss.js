/**
 * This object is intended to create and reference a Swisstournament singleton
 */
define([ '../backend/swisstournament' ], function (Swisstournament) {
  var Swiss;

  Swiss = new Swisstournament();

  if (Swiss.reset) {
    console.error('Swiss.reset() already defined');
    return undefined;
  }

  Swiss.reset = function () {
    Swiss.fromBlob((new Swisstournament()).toBlob());
  };

  return Swiss;
});
