define([ './options' ], function (Options) {
  var Tabs;

  Tabs = function (tabselector, imgpattern, enforce) {
    imgpattern = imgpattern || 'images/%s.png';

    // TODO update opts

    $(function ($) {
      var tabs, keys, opts, $menu, $body;

      tabs = [];
      keys = [];
      opts = [];

      // get tabs
      $(tabselector).each(function (i, elem) {
        var tab, key, opt, $elem;
        $elem = $(elem);

        tab = $elem.attr('id');
        key = $elem.attr('accesskey');
        opt = $elem.attr('data-tabimgopt');

        if (tab) {
          tabs.push(tab);
          keys.push(key);
          if (key) {
            $elem.removeAttr('accesskey');
          }
          opts.push(opt);
          if (opt) {
            $elem.removeAttr('data-tabimgopt');
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
        if (opts[i]) {
          $img.attr('src', imgpattern.replace('%s', tabname + Options[opts[i]]));
        } else {
          $img.attr('src', imgpattern.replace('%s', tabname));
        }

        $tab = $('<a>');
        $tab.attr('href', '#' + tabname);
        $tab.attr('tabindex', '-1');
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
        $a.attr('tabindex', '-1');
        $a.attr('accesskey', key);
        $body.append($a);
      });

      // show the first tab of this set if hash doesn't match any of them
      if (enforce && tabs.indexOf(location.hash.replace('#', '')) === -1) {
        location.hash = '#' + tabs[0];
      }

      $(window).on('hashchange', function () {
        window.scrollTo(0, 0);
      });
    });
  };

  return Tabs;
});