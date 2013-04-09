define([ './toast', './strings', './serializer' ], function (Toast, Strings,
    Serializer) {
  var Tab_Storage;

  Tab_Storage = {};

  $(function ($) {
    Tab_Storage.test = function () {
      var txt;

      txt = Serializer.serialize();
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
