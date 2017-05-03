/**
 * Hotkeys for the font size. Hooks as directly as possible into the fontsize
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery'], function($) {
  var FontHotkeys, $buttons;

  FontHotkeys = undefined;
  $buttons = undefined;

  function hashcheck() {
    var fontSize;

    if (!$buttons) {
      return;
    }

    if (window.location.hash === '#font+') {
      setFontSize(getFontSize() + 1);
      window.location.hash = '';
    } else if (window.location.hash === '#font-') {
      setFontSize(getFontSize() - 1);
      window.location.hash = '';
    }
  }

  function getFontSize() {
    var fontSize = -1;

    $buttons.each(function(index) {
      if ($(this).parent().hasClass($(this).attr('class'))) {
        fontSize = index;
      }
    });

    return fontSize;
  }

  function setFontSize(fontSize) {
    index = Math.min(Math.max(fontSize, 0), $buttons.length - 1);

    $buttons.eq(index).click();
  }

  $(window).on('hashchange', function() {
    hashcheck();
  });

  $(function($) {
    $buttons = $('#tabs>[data-tab="settings"] .fontsizeview:first button');
  });

  return FontHotkeys;
});
