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

    $that.bind('focusout change', function() {
      var name = $text.val();
      var p = Player.list[Number(location.hash.slice(8))];
      if (name) {
        p.name = name;
        Page_Players.updatePlayer(p);
        Storage.set('players', Player);
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

    $that.bind('focusout change', function() {
      var year = $text.val();
      var p = Player.list[Number(location.hash.slice(8))];
      p.year = year;
      Page_Players.updatePlayer(p);
      Storage.set('players', Player);
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

    $that.bind('focusout change', function() {
      var city = $text.val();
      var p = Player.list[Number(location.hash.slice(8))];
      if (city) {
        p.setCity(city);
        Page_Players.updatePlayer(p);
        Storage.set('players', Player);
      }
      $this.text(city);
      $that.after($this);
      $that.remove();
    });
  });

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

    $that.bind('focusout change', function() {
      var assoc = $text.val();
      var p = Player.list[Number(location.hash.slice(8))];
      if (assoc)  {
        p.setAssoc(assoc);
        Page_Players.updatePlayer(p);
        Storage.set('players', Player);
      }
      $this.text(assoc);
      $that.after($this);
      $that.remove();
    });
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

});

