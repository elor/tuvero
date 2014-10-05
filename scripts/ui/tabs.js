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
      valid : undefined,
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
    this.focus = function (tabname) {
      that.focus(tabname);
    };

    this.valid = function () {
      that.openValidTab();
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

        tabindex = tabs.indexOf(currentTab);
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

        $tab = $('<a>');
        $tab.attr('href', '#' + tabname);
        $tab.attr('tabindex', '-1');
        // if (keys) {
        // $tab.attr('accesskey', keys[i]);
        // }

        $img = $('<div>');
        if (opts[i]) {
          $img.attr('data-img', imgpattern.replace('%s', tabname + Options[opts[i]]));
        } else {
          $img.attr('data-img', imgpattern.replace('%s', tabname));
        }

        $tab.append($img);

        $menu.append($tab);
      }, this);

      // copy modified version to every page
      tabs.forEach(function (tabname) {
        var $page, $clone;
        $page = $('#' + tabname);
        $clone = $menu.clone();

        $clone.find('a[href=#' + tabname + ']').addClass('open');

        $page.prepend($clone);
        $menus[tabname] = $clone;
      }, this);

      // add event handlers for menu items
      $('#tabs').on('click', '.tabs a', function (e) {
        var hash;
        hash = $(this).attr('href');
        location.hash = hash;
        window.scrollTo(0, 0);
        e.preventDefault();
        return false;
      });

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

      $(window).on('hashchange', function () {
        if (location.hash !== '#reset') {
          window.scrollTo(0, 0);
          openValidTab();
        }

        return true;
      });

      that.updateOpts = function () {
        opts.forEach(function (opt, i) {
          var tab;

          tab = tabs[i];

          if (opt) {
            $('.tabs a[href=#' + tab + '] [data-img]').attr('data-img', imgpattern.replace('%s', tab + Options[opt]));
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

      that.focus = function (tabname) {
        var key, index, currentTab;

        index = tabs.indexOf(tabname);
        if (index === -1) {
          // console.error('tabname ' + tabname + ' not found');
          return;
        }

        currentTab = location.hash.replace(/^#/, '');

        if (currentTab !== tabname) {
          if (currentTab !== 'debug') {
            if (visible[index]) {
              window.location.hash = '#' + tabname;
            }
          }
        }

        openValidTab();
      };

      that.openValidTab = openValidTab;
    });

    return this;
  };

  return Tabs;
});