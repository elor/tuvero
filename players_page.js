$(function ($) {
  $('.player').live('click', function (evt) {
    if ($(evt.target.parentNode).hasClass('player') && $(evt.target).hasClass('switch')) {
      evt.target = evt.target.parentNode;
    }

    if (!$(evt.target).hasClass('player')) {
      return;
    }

    if ($(evt.target).hasClass('inactive')) {
      $(evt.target).removeClass('inactive');
    } else {
      $(evt.target).addClass('inactive');
    }
  });
  
  $('.player.new .gender').click( function (evt) {
    var $this = $(this);
    if ($this.hasClass('m')) {
      $this.removeClass('m').addClass('f');
    } else {
      $this.removeClass('f').addClass('m');
    }
  });

  $('.player .technique .s').live('click', function (evt) {
    var $this = $(this.parentNode);
    if ($this.hasClass('s')) {
      $this.removeClass('s');
    } else {
      $this.addClass('s');
    }
  });

  $('.player .technique .l').live('click', function (evt) {
    var $this = $(this.parentNode);
    if ($this.hasClass('l')) {
      $this.removeClass('l');
    } else {
      $this.addClass('l');
    }
  });

  $('.player .pool').live('click', function (evt) {
    var $this = $(this);
    if ($this.hasClass('a')) {
      $this.removeClass('a');
      $this.addClass('b');
    } else {
      $this.removeClass('b');
      $this.addClass('a');
    }
  });

  $('.player.new form').submit(function (evt) {
    $('.player.new .create').trigger('click');
    return false;
  });
  
  $('.player.new .create').click(function (evt) {
    // set up references
    var $input = $('.player.new');
    var $name = $('.player.new .name');

    if (!$name.val()) {
      return;
    }

    // create the instance of the new player
    var p = new Player(Player.list.length, $name.val());
    Player.list.push(p);

    // set player properties
    if ($input.find('.gender').hasClass('f')) {
      p.female = true;
    }

    if ($input.hasClass('inactive')) {
      p.inactive = true;
    }

    if ($input.find('.technique').hasClass('s')) {
      p.S = true;
    }
    if ($input.find('.technique').hasClass('l')) {
      p.L = true;
    }

    if ($input.find('.pool').hasClass('b')) {
      p.B = true;
    }

    // reset the input form
    // no complete reset necessary
    $name.val('');
    $input.removeClass('inactive');

    // add the new player to the DOM
    addPlayer(p);
  });

  // addPlayer()
  //   p - the Player instance to be added to the DOM
  // 
  // This function takes a player instance, removes a probably existing entry
  // from the DOM and adds a new one, which is just a brief clone of the player
  // template filled with the player data
  function addPlayer(p) {
    // remove existing element
    $('#pid' + p.id).remove();

    // clone the player template
    $new = $('.player.tpl').clone().removeClass('tpl');

    // fill with data
    $new.find('.name').text(p.name);
    $new.attr('id', 'pid' + p.id);

    if (p.female) {
      $new.find('.gender').addClass('f');
    } else {
      $new.find('.gender').addClass('m');
    }

    if (p.S) {
      $new.find('.technique').addClass('s');
    }
    
    if (p.L) {
      $new.find('.technique').addClass('l');
    }

    if (p.B) {
      $new.find('.pool').addClass('b');
    } else {
      $new.find('.pool').addClass('a');
    }
    
    // release it into the DOM
    $('.player.new').before($new);
  }

  function restorePlayers() {
    $('.player:not(.tpl):not(.new)').remove();

    Player.load();

    for (var f in Player.list) {
      addPlayer(Player.list[f]);
    }
  }
  
  restorePlayers();
});

