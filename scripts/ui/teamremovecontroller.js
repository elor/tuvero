/**
 * handle team removals
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './controller', './valuemodel', './listclickcontroller',
    './classview'], function(extend, Controller, ValueModel,
    ListClickController, ClassView) {

  /**
   * Constructor
   */
  function TeamRemoveController(view, $activatebutton, $tab) {
    var active, removecontroller, classview;
    TeamRemoveController.superconstructor.call(this, view);

    active = new ValueModel(false);

    removecontroller = new ListClickController(this.view,
        TeamRemoveController.removalCallback, active, undefined, active);

    classview = new ClassView(active, $tab, 'deletion');

    $activatebutton.click(function(e) {
      active.set(!active.get());
      e.preventDefault();
      return false;
    });

    $(window).on('hashchange', function() {
      active.set(false);
    });

    $(document).keydown(function(e) {
      if (active.get() && e.which === 27) {
        active.set(false);
        e.preventDefault();
        return false;
      }
    });

    $tab.click(function(e) {
      if (active.get()) {
        active.set(false);
        e.preventDefault();
        return false;
      }
    });
  }

  extend(TeamRemoveController, Controller);

  TeamRemoveController.removalCallback = function(model, index) {
    model.remove(index);
    this.set(false);
  };

  return TeamRemoveController;
});
