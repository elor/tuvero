Page_New = (function() {
  function newPlayer() {
    var $newplayer = $('#newplayer');
    var $form = $('#newplayer_input');
    var $preview = $newplayer.find('.preview');

    var invalid = [];
    var $name = $form.find('.name');
    var name = $name.val();

    if (!name) {
      invalid.push($name);
    }

    var $year = $form.find('.year');
    var yearmax = Number($year.attr('max'));
    var yearmin = Number($year.attr('min'));
    var year = Number($year.val()) || 0;

    if (year < yearmin) {
      if (year <= 0) {
        invalid.push($year)
      } else if (year < 100) {
        year += 1900;
      } else {
        invalid.push($year)
      }
    }

    var female = $form.find('.gender').hasClass('f');

    var $city = $form.find('.city');
    var city = $city.val();

    if (!city) {
      invalid.push($city);
    }

    var $assoc = $form.find('.assoc');
    var assoc = $assoc.val();

    if (!assoc) {
      invalid.push($assoc);
    }

    var i;
    var length = invalid.length;

    if (length) {
      for (i = 0; i < length; ++i) {
        invalid[i].addClass('redbg');
      }

      window.setTimeout(function() {
        for (i = 0; i < length; ++i) {
          invalid[i].removeClass('redbg');
        }
      }, 800);
    } else {
      $preview.find('.name').text(name);
      $preview.find('.year').text(year);
      if (female) {
        $preview.find('.gender').addClass('f');
      }
      $preview.find('.city').text(city);
      $preview.find('.assoc').text(assoc);
      
      $newplayer.addClass('preview');
    }
  };

  function correctPlayer() {
    $('#newplayer').removeClass('preview');
  }

  function confirmPlayer() {
    var $newplayer = $('#newplayer');
    var $form = $('#newplayer_input');
    var $preview = $newplayer.find('.preview');

    $form.find('.name').val('');
    $form.find('.year').val('');
    $form.find('.gender').removeClass('f');
    $form.find('.city').val('');
    $form.find('.assoc').val('');
    $newplayer.removeClass('preview');

    var init = {
      name: $preview.find('.name').text(),
      female: $preview.find('.gender').hasClass('f'),
      year: Number($preview.find('.year').text()),
      city: $preview.find('.city').text(),
      assoc: $preview.find('.assoc').text()
    };

    Page_Players.addPlayer(new Player(init));
    Storage.set('players', Player);
  }

  return {
    newPlayer: newPlayer,
    confirmPlayer: confirmPlayer,
    correctPlayer: correctPlayer
  };
})();

