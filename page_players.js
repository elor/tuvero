Page_Players = (function () {
  // addPlayer()
  //   p - the Player instance to be added to the DOM
  // 
  // This function takes a player instance, removes a probably existing entry
  // from the DOM and adds a new one, which is just a brief clone of the player
  // template filled with the player data
  function addPlayer(p) {
    // remove existing element
    removePlayer(p);

    // clone the player template
    var $new = $('.player.tpl').clone().removeClass('tpl');

    $new.attr('href', '#profile' + p.id);

    // fill with data
    $new.find('.name').text(p.name);
    $new.find('.year').text(p.year.toString());
    $new.find('.city').text(p.getCity());
    $new.find('.assoc').text(p.getAssociation());

    if (p.id !== undefined) {
      $new.attr('id', 'pid' + p.id);
    }

    if (p.female) {
      $new.find('.gender').addClass('f');
    }

    // release it into the DOM
    $('.player.tpl').before($new);
  }

  function removePlayer(p) {
    $('#pid' + p.id).remove();
  }

  function savePlayers() {
    Storage.set('players', Players);
  }

  // restore players...
  function restorePlayers() {
    $('.player:not(.tpl)').remove();

    Player.fromString(Storage.get('players'));

    for (var f in Player.list) {
      addPlayer(Player.list[f]);
    }
  }

  var $profile;

  function showProfile(p) {
    if (!$profile) {
      $profile = $('#profile');
      $profile.remove();
    }

    var $new = $profile.clone().attr('id', location.hash.slice(1));
    $new.find('.name').text(p.name);
    $new.find('.year').text(p.year.toString());
    $new.find('.city').text(p.getCity());
    $new.find('.assoc').text(p.getAssociation());
    if (p.female) {
      $new.find('.gender').addClass('f');
    }
    $new.find('.id').text(p.id);
    $('#players').before($new).focus();

    $('.menu .open').removeClass('open');
    $('#playersicon').addClass('open');

    return $new;
  }

  return {
    savePlayers: savePlayers,
    restorePlayers: restorePlayers,
    addPlayer: addPlayer,
    showProfile: showProfile
  };
})();

