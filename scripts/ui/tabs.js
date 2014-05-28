define([ './options' ], function (Options) {
  var Tabs;

  Tabs = function (tabselector, imgpattern, enforce) {
    var that;

    that = {
      tabs : [],
      keys : [],
      opts : [],
      updateOpts : undefined,
      hide : undefined,
      show : undefined,
    };

    this.updateOpts = function () {
      that.updateOpts();
    };

    this.hide = function (tabname) {
      that.display(tabname, false);
    };

    this.show = function (tabname) {
      that.display(tabname, true);
    };

    imgpattern = imgpattern || 'images/%s.png';

    $(function ($) {
      var tabs, keys, opts, $menu, $body, $links, $menus, visible;

      tabs = that.tabs;
      keys = that.keys;
      opts = that.opts;
      $links = {};
      $menus = {};
      visible = [];

      function openValidTab () {
        var tabindex, index, currentTab;

        // show the first tab of this set if hash doesn't match any of them
        currentTab = location.hash.replace(/^#/, '');

        if (currentTab === 'debug') {
          // don't mess with a guy who's just debugging
          return;
        }

        tabindex = tabs.indexOf();
        // TODO apply parens to make this line clear!
        if (enforce && tabindex === -1 || !visible[tabindex]) {
          index = visible.indexOf(true);
          if (index === -1) {
            // console.error('no visible tabs to force open');
          } else {
            location.hash = '#' + tabs[index];
          }
        }
      }

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
          visible.push(true);
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
        $menus[tabname] = $clone;
      }, this);

      // create empty invisible links to every tab
      $body = $('body');
      keys.forEach(function (key, index) {
        var $a = $('<a>');
        $a.attr('href', '#' + tabs[index]);
        $a.attr('tabindex', '-1');
        $a.attr('accesskey', key);
        $body.append($a);
        $links[tabs[index]] = $a;
      });

      openValidTab();

      $(window).on('hashchange', function () {
        window.scrollTo(0, 0);
      });

      that.updateOpts = function () {
        opts.forEach(function (opt, i) {
          var tab;

          tab = tabs[i];

          if (opt) {
            $('.tabs a[href=#' + tab + '] img').attr('src', imgpattern.replace('%s', tab + Options[opt]));
          }
        });
      };

      /**
       * show/hide all references to a certain
       */
      that.display = function (tabname, val) {
        var key, index;

        if (typeof (val) !== 'boolean') {
          // my own mistake
          return;
        }

        index = tabs.indexOf(tabname);
        if (index === -1) {
          // console.error('tabname ' + tabname + ' not found');
          return;
        }

        // hide tabs in all menus
        for (key in $menus) {
          $menus[key].find('a[href=#' + tabname + ']').css('display', (val ? '' : 'none'));
        }

        // hide hidden hotkey links
        if ($links[tabname]) {
          if (val) {
            $links[tabname].attr('accesskey', keys[index]);
          } else {
            $links[tabname].removeAttr('accesskey');
          }
        }

        visible[index] = val;
        openValidTab();
      };
    });

    return this;
  };

  return Tabs;
});