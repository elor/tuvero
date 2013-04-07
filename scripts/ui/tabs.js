define(function () {
  var Tabs;

  Tabs = function (tabselector, imgpattern, enforce) {
    imgpattern = imgpattern || 'images/%s.png';

    $(function ($) {
      var tabs, keys, $menu, $body;

      tabs = [];
      keys = [];

      // get tabs
      $(tabselector).each(function (i, elem) {
        var tab, key, $elem;
        $elem = $(elem);

        tab = $elem.attr('id');
        key = $elem.attr('accesskey');

        if (tab) {
          tabs.push(tab);
          keys.push(key);
          if (key) {
            $elem.removeAttr('accesskey');
          }
        }
      });

      // construct empty menu
      $menu = $('<div></div>');
      $menu.addClass('tabs');

      // add icons
      tabs.forEach(function (tabname, i) {
        var $img, $tab;

        $img = $('<img>');
        $img.attr('src', imgpattern.replace('%s', tabname));

        $tab = $('<a>');
        $tab.attr('href', '#' + tabname);
        // if (keys) {
        // $tab.attr('accesskey', keys[i]);
        // }
        $tab.append($img);

        $menu.append($tab);
      }, this);

      // copy modified version to every page
      tabs.forEach(function (tabname) {
        var $page, $clone;
        $page = $('#' + tabname);
        $clone = $menu.clone();

        $clone.find('a[href=#' + tabname + '] > img').addClass('open');

        $page.prepend($clone);
      }, this);

      // create empty invisible links to every tab
      $body = $('body');
      keys.forEach(function (key, index) {
        var $a = $('<a>');
        $a.attr('href', '#' + tabs[index]);
        $a.attr('accesskey', key);
        $body.append($a);
      });

      // enforce
      if (enforce && tabs.indexOf(location.hash.replace('#', '')) === -1) {
        location.hash = '#' + tabs[0];
      }
    });
  };

  return Tabs;
});