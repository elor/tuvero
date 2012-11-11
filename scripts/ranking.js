define(function () {
  return {
    Interface : {
      getRanking : function () {
        return []; // sorted list of ids (corresponding to players)
      },
      addGame : function (result) {
        return;
      },
      eraseGame : function (result) {
        return;
      },
      correctGame : function (oldresult, newresult) {
        return;
      }
    },
    newResult : function (teama, pointsa, teamb, pointsb) {
      if (typeof (teama) === 'number') {
        teama = [ teama ];
      }
      if (typeof (teamb) === 'number') {
        teamb = [ teamb ];
      }

      return {
        a : teama,
        b : teamb,
        pa : pointsa,
        pb : pointsb
      };
    }
  };
});
