/**
 * listens to a ValueModel instance and resets the tab images when it changes
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listener', './tabshandle'],
    function(extend, Listener, Tabshandle) {

      /**
       * Constructor
       *
       * @param model
       *          a ValueModel instance
       */
      function TabOptsListener(model) {
        TabOptsListener.superconstructor.call(this, model);

        this.update();
      }
      extend(TabOptsListener, Listener);

      /**
       * update the tab images
       */
      TabOptsListener.prototype.update = function() {
        Tabshandle.updateOpts();
      };

      /**
       * Callback function
       */
      TabOptsListener.prototype.onupdate = function() {
        this.update();
      };

      return TabOptsListener;
    });
