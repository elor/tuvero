$(function ($) {
  Page_Players.restorePlayers();

  function openTab(name) {
    $('.menu .open').removeClass('open');
    location.hash = name;
    $(name).focus();
    $(name + 'icon').addClass('open');
  }
  
  if (!location.hash) {
    openTab('#players');
  }

  $(location.hash + 'icon').addClass('open');

  $('#playersicon').click(function(evt) {
    openTab('#players');
  });

  var $currentProfile = undefined;

  function profilehash() {
    if ($currentProfile) {
      $currentProfile.remove();
      $currentProfile = undefined;
    }

    if (location.hash.length > 8 && location.hash.slice(0, 8) === '#profile') {
      var id = Number(location.hash.slice(8));
      var p = Player.list[id];

      if (p) {
        $currentProfile = Page_Players.showProfile(p);
      } else {
        openTab('#players');
      }

    }
  }

  profilehash();

  $(window).bind('hashchange', profilehash);

  $('.profile table .name').live('click', function() {
    var $this = $(this);
    var $that = $('<td>');
    var $text = $('<input>');
    $that.addClass('tmp');
    $text.attr('type', 'text');
    $text.val($this.text());
    $that.append($text);

    $this.after($that);
    $this.detach();
    $text.focus();

    $that.keydown(function(e) {
      if (e.keyCode === 9 && !e.shiftKey) {
        $('.profile table .year').click();
        return false;
      }
    });

    $that.bind('focusout change', function() {
      var name = $text.val();
      var p = Player.list[Number(location.hash.slice(8))];
      if (name && name != p.name) {
        p.name = name;
        Page_Players.updatePlayer(p);
        Storage.set('players', Player);
      } else {
        name = p.name;
      }
      $this.text(name);
      $that.after($this);
      $that.remove();
    });
  });

  $('.profile table .gender').live('click', function() {
    var female =  $(this).toggleClass('f').hasClass('f');
    var p = Player.list[Number(location.hash.slice(8))];
    p.female = female;
    Page_Players.updatePlayer(p);
    Storage.set('players', Player);
  });

  $('.profile table .year').live('click', function() {
    var $this = $(this);
    var $that = $('<td>');
    var $text = $('<input>');
    $that.addClass('tmp');
    $text.attr('type', 'number');
    $text.attr('min', '1900');
    $text.attr('max', '2020');
    $text.val($this.text());
    $that.append($text);

    $this.after($that);
    $this.detach();
    $text.focus();

    $that.keydown(function(e) {
      if (e.keyCode === 9) {
        if (e.shiftKey) {
          $('.profile table .name').click();
        } else {
          $('.profile table .city').click();
        }
        return false;
      }
    });

    $that.bind('focusout change', function() {
      var year = Number($text.val());
      var p = Player.list[Number(location.hash.slice(8))];
      if (year && year != p.year) {
        p.year = year;
        Page_Players.updatePlayer(p);
        Storage.set('players', Player);
      } else {
        year = p.year;
      }
      $this.text(year);
      $that.after($this);
      $that.remove();
    });
  });

  $('.profile table .city').live('click', function() {
    var $this = $(this);
    var $that = $('<td>');
    var $text = $('<input>');
    $that.addClass('tmp');
    $text.attr('type', 'text');
    $text.val($this.text());
    $that.append($text);

    $this.after($that);
    $this.detach();
    $text.focus();

    $that.keydown(function(e) {
      if (e.keyCode === 9) {
        if (e.shiftKey) {
          $('.profile table .year').click();
        } else {
          $('.profile table .assoc').click();
        }
        return false;
      }
    });

    $that.bind('focusout change', function() {
      var city = $text.val();
      var p = Player.list[Number(location.hash.slice(8))];
      if (city && city != p.getCity()) {
        p.setCity(city);
        Page_Players.updatePlayer(p);
        Storage.set('players', Player);
      } else {
        city = p.getCity();
      }
      $this.text(city);
      $that.after($this);
      $that.remove();
    });
  })

  $('.profile table .assoc').live('click', function() {
    var $this = $(this);
    var $that = $('<td>');
    var $text = $('<input>');
    $that.addClass('tmp');
    $text.attr('type', 'text');
    $text.val($this.text());
    $that.append($text);

    $this.after($that);
    $this.detach();
    $text.focus();

    $that.keydown(function(e) {
      if (e.keyCode === 9 && e.shiftKey) {
        $('.profile table .city').click();
        return false;
      }
    });

    $that.bind('focusout change', function() {
      var assoc = $text.val();
      var p = Player.list[Number(location.hash.slice(8))];
      if (assoc && assoc != p.getAssoc())  {
        p.setAssoc(assoc);
        Page_Players.updatePlayer(p);
        Storage.set('players', Player);
      } else {
        assoc = p.getAssoc();
      }
      $this.text(assoc);
      $that.after($this);
      $that.remove();
    });
  });

  $('#rankingicon').click(function(evt) {
    openTab('#ranking');
  });

  $('#newicon').click(function(evt) {
    openTab('#new');
  });

  $('#newplayer_input .gender').click(function() {
    $(this).toggleClass('f');
  });

  $('#newplayer_input .submit').click(function() {
    Page_New.newPlayer();
  });

  $('#newplayer .preview .correct').click(function() {
    Page_New.correctPlayer();
  });

  $('#newplayer .preview .submit').click(function() {
    Page_New.confirmPlayer();
  });

  $('.playersearch .sortdir').click(function() {
    $(this).toggleClass('desc');

    Page_Players.sortPlayers();
  });

  var sortmode;
  $('.playersearch .sorting').on('click keyup blur', function() {
    var tmp = $(this).val();
    if (tmp != sortmode) {
      sortmode = tmp;
      Page_Players.sortPlayers();
    }
  }).click();

  $('.playersearch .gender').click(function() {
    var $this = $(this);

    // m f mf
    if ($this.hasClass('f')) {
      if ($this.hasClass('m')) {
        $this.removeClass('f');
      } else {
        $this.addClass('m');
      }
    } else {
      $this.addClass('f');
      $this.removeClass('m');
    }

    Page_Players.filterPlayers();
  });


  var $minyear = $('#players .playersearch .minyear');
  var $maxyear = $('#players .playersearch .maxyear');
  var $query = $('#players .playersearch .query');
  var query;
  var minyear, maxyear;

  function updateYears() {
    var tmp = Number($minyear.val());
    var changed = false;
    if (tmp != minyear) {
      minyear = tmp;
      changed = true;
    }

    tmp = Number($maxyear.val());
    if (tmp != maxyear) {
      maxyear = tmp;
      changed = true;
    }

    tmp = $query.val();
    if (tmp != query) {
      query = tmp;
      changed = true;
    }

    if (changed) {
      Page_Players.filterPlayers();
    }
  }

  var minterval;

  $query.on("blur mouseup click change keyup", function() {
    updateYears();
  });

  $minyear.on("blur mouseup click change keyup", function() {
    updateYears();
  });

  $maxyear.on("blur mouseup click change keyup", function() {
    updateYears();
  });

});

