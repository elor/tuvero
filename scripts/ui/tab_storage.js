define([ './toast', './strings', './team', './history', './tab_ranking' ],
    function (Toast, Strings, Team, History, Tab_Ranking) {
      var Tab_Storage, all;

      Tab_Storage = {};

      all = {
        toCSV : function () {
          var sets;

          sets = [];

          sets.push(Team.toCSV());
          sets.push(Tab_Ranking.toCSV());
          sets.push(History.toCSV());

          return sets.join('\r\n""\r\n');
        }
      };

      $(function ($) {
        Tab_Storage.test = function () {
          var txt;

          txt = all.toCSV();
          console.log(txt);
          console.log(txt.length);
        };

        $('#storage button.test').click(Tab_Storage.test);

        $('#storage button.finishgames').click(function () {
          var i;
          for (i = 0; i < 10; i += 1) {
            $($('#games .running .game input')[0]).val(13);
            $($('#games .running .game input')[1]).val(8);
            $($('#games .running .game button')[0]).click();
          }
        });

      });

      return Tab_Storage;
    });
