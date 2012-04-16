Page_Players = (function () {
  // updatePlayer()
  //   p - the Player instance to be added to the DOM
  // 
  // This function takes a player instance, removes a probably existing entry
  // from the DOM and adds a new one, which is just a brief clone of the player
  // template filled with the player data
  function updatePlayer(p) {
    var $old = $('#pid' + p.id);

    if (!$old.length) {
      $old = undefined;
    } else {
      $old.removeAttr('id');
    }
    var $new = $('.player.tpl').clone().removeClass('tpl');

    $new.attr('href', '#profile' + p.id);

    // fill with data
    $new.find('.name').text(p.name);
    $new.find('.year').text(p.year.toString());
    $new.find('.city').text(p.getCity());
    $new.find('.assoc').text(p.getAssoc());

    if (p.id !== undefined) {
      $new.attr('id', 'pid' + p.id);
    }

    if (p.female) {
      $new.find('.gender').addClass('f');
    }

    if ($old) {
      $old.before($new);
      $old.remove();
    } else {
      $('.player.tpl').before($new);
    }
  }

  function savePlayers() {
    Storage.set('players', Players);
  }

  // restore players...
  function restorePlayers() {
    $('#players .player:not(.tpl)').remove();

    Player.fromString(Storage.get('players'));

    var str = [];
    var $tpl = $('#players .player.tpl');
    var tpl = ['<a href="#profile%id" class="player" id="pid%id">', $tpl.html(), '</a>'].join('');

    var P = Player.list;
    var i, len = P.length;
    var p;

    for (i=0; i < len; ++i) {
      p = P[i];
      str.push(tpl.replace(/%id/g, i).replace(/%name/, p.name).replace(/%year/, p.year).replace(/%city/, p.getCity()).replace(/%assoc/, p.getAssoc()));
    }

    $tpl.before($(str.join('')));
  }

  var $profile;

  function showProfile(p) {
    if (!$profile) {
      $profile = $('#profile');
      $profile.detach();
    }

    var $new = $profile.clone().attr('id', location.hash.slice(1));
    $new.find('.name').text(p.name);
    $new.find('.year').text(p.year.toString());
    $new.find('.city').text(p.getCity());
    $new.find('.assoc').text(p.getAssoc());
    if (p.female) {
      $new.find('.gender').addClass('f');
    }
    $new.find('.id').text(p.id);
    $('#players').before($new).focus();

    $('.menu .open').removeClass('open');
    $('#playersicon').addClass('open');

    return $new;
  }

  function sortPlayers() {
    var mode = $('#players .playersearch .sorting').val();
    var descending = $('#players .playersearch .sortdir').hasClass('desc');

    var list = [];
    var i;
    var p = Player.list;
    var len = p.length;
    var $refs = [];

    for (i = 0; i < len; ++i) {
      list[i] = i;
      $refs[i] = $('#pid' + i).detach();
    }

    switch (mode) {
    case undefined:
    case 'id':
      // already sorted
      break;
    case 'name':
      list.sort(function(a, b) {
        if (p[a].name < p[b].name) {
          return -1;
        } else {
          return 1;
        }
      });
      break;
    case 'year':
      list.sort(function(a, b) {
        return p[a].year - p[b].year;
      });
      break;
    }

    var $tpl = $('#players .player.tpl');

    if (descending) {
      for (i = 0; i < len; ++i) {
        $tpl.before($refs[i]);
      }
    } else {
      for (i = len - 1; i >= 0; --i) {
        $tpl.before($refs[i]);
      }
    }
  }

  function filterPlayers() {
    var $gender = $('#players .playersearch .gender');
    var male = $gender.hasClass('m');
    var female = $gender.hasClass('f');
    var minyear = Number($('#players .playersearch .minyear').val());
    var maxyear = Number($('#players .playersearch .maxyear').val());
    var $list = $('#players .player:not(.tpl)');

    if (minyear < 1900 || minyear > 2020) {
      minyear = undefined;
    }

    if (maxyear < 1900 || maxyear > 2020) {
      maxyear = undefined;
    }

    $list.each(function (index) {
      var $this = $(this);
      var $gender = $this.find('.gender');
      var year = Number($this.find('.year').text());
      var hide;

      switch (true) {
      case !male && !$gender.hasClass('f'):
      case !female && $gender.hasClass('f'):
      case minyear && minyear > year:
      case maxyear && maxyear < year:
        hide = true;
        break;
      }

      if (hide) {
        $this.addClass('hidden');
      } else {
        $this.removeClass('hidden');
      }
    });
  }

  return {
    savePlayers: savePlayers,
    restorePlayers: restorePlayers,
    updatePlayer: updatePlayer,
    showProfile: showProfile,
    sortPlayers: sortPlayers,
    filterPlayers: filterPlayers,
  };
})();

