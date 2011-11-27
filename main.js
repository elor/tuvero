$(function ($) {
  $('#playersicon').click(function(evt) {
    location.hash='players';
  });
  
  $('#sundayicon').click(function(evt) {
    location.hash='sunday';
  });
  
  $('#newicon').click(function(evt) {
    location.hash='new';
  });
  
  $('.player .active').live('click', function (evt) {
    if ($(evt.target).hasClass('new')) {
      $(evt.target.parentNode.parentNode).addClass('inactive');
    } else {
      $(evt.target.parentNode).addClass('inactive');
    }
  });
  
  $('.player .inactive').live('click', function (evt) {
    if ($(evt.target).hasClass('new')) {
      $(evt.target.parentNode.parentNode).removeClass('inactive');
    } else {
      $(evt.target.parentNode).removeClass('inactive');
    }
  });

  $('.player.new .gender').click( function (evt) {
    var $this = $(this);
    if ($this.hasClass('m')) {
      $this.removeClass('m');
      $this.addClass('f');
    } else {
      $this.removeClass('f');
      $this.addClass('m');
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
    // get shortcut variables
    var $new = $('#pid0').clone();
    var $input = $('.player.new');
    var $name = $('.player.new .name');
    // set the name
    $new.find('.name').text($name.val());
    // set the status
    if ($input.hasClass('inactive')) {
      $new.addClass('inactive');
    } else {
      $new.removeClass('inactive');
    }
    // reset the name and state of the input field
    $name.val('');
    $input.removeClass('inactive');
    // add the new element
    $input.before($new);
  });
});

