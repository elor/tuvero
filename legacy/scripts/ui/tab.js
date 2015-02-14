/**
 * Tab Interface
 *
 * @expost Tab
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['./opts', './toast', './strings'], function(Opts, Toast, Strings) {

  return {
    Interface: {
      /**
       * Reset to an empty state, usually the initial state
       *
       * @return {boolean} true on success, false on error
       */
      reset: function() {
        return true;
      },
      /**
       * Update everything to the current overall state
       *
       * @return {boolean} true on success, false on error
       */
      update: function() {
        return true;
      }
    },

    createTab: function(name, reset, update, options) {
      var tab, updatepending; // , visibleupdatepending;

      if (options === undefined) {
        options = {};
      }

      updatepending = false;
      // visibleupdatepending = false;

      tab = {
        reset: function() {
          try {
            reset();
          } catch (err) {
            console.error(err.stack);
          }
        },

        update: function(force) {
          if (force) {
            updatepending = false;
            // visibleupdatepending = false;
          }

          if (!updatepending) {
            updatepending = true;
            window.setTimeout(function() {
              try {

                update();

              } catch (er) {
                console.error(er.stack);
                new Toast(Strings.tabupdateerror.replace('%s', Strings['tab_' + name]));
              }
              updatepending = false;
            }, 1);
          }
        },

        getOptions: function() {
          return Opts.getOptions({
            options: options
          });
        },

        setOptions: function(opts) {
          if (Opts.setOptions({
            options: options
          }, opts)) {
            if (options._changed) {
              options._changed();
            }
            return true;
          }
          return false;
        }
      };

      // update whenever the tab opens. This is quick and dirty.
      // // FIXME use something that works for all tabs.
      // window.addEventListener('hashchange', function () {
      // if (window.location.hash === '#' + name && visibleupdatepending) {
      // tab.update();
      // visibleupdatepending = false;
      // }
      // });
      //
      return tab;
    },

    Extends: [Opts.Interface]
  };
});
