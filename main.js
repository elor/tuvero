$(function ($) {

  function openTab(name) {
    $('.menu .open').removeClass('open');
    location.hash=name;
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
  
  $('#sundayicon').click(function(evt) {
    openTab('#sunday');
  });
  
  $('#newicon').click(function(evt) {
    openTab('#new');
  });

});

