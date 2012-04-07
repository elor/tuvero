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

