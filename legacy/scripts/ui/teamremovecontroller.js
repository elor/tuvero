/**
 * handle team removals
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './controller', './valuemodel', './listclickcontroller',
    './classview', './view'], function(extend, Controller, ValueModel,
    ListClickController, ClassView, View) {

  /**
   * Constructor
   */
  function TeamRemoveController(views, $activatebutton, $tab) {
    var active;
    TeamRemoveController.superconstructor.call(this, new View(undefined,
        $activatebutton));

    this.views = views;
    active = new ValueModel(false);

    this.clickControllers = this.views.map(function(view) {
      var options;

      options = {
        active: active,
        event: 'mousedown',
        callbackthis: active
      };

      return new ListClickController(view,
          TeamRemoveController.removalCallback, options);
    });

    this.classview = new ClassView(active, $tab, 'deletion');

    $activatebutton.click(function(e) {
      // activate/deactivate when clicking the button
      active.set(!active.get());
      e.preventDefault();
      return false;
    }).blur(function() {
      active.set(false);
    });

    $(document).keydown(function(e) {
      if (active.get() && e.which === 27) {
        active.set(false);
        e.preventDefault();
        return false;
      }
    });
  }

  extend(TeamRemoveController, Controller);

  /**
   * remove a team from the list of teams
   *
   * @param model
   *          a ListModel instance
   * @param index
   *          the index to remove from model
   */
  TeamRemoveController.removalCallback = function(model, index) {
    model.remove(index);
    this.set(false);
  };

  return TeamRemoveController;
});
