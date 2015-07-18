/**
 * RankingOrderController: Handle buttons and keypresses in the
 * RankingOrderView. This Controller has slightly more logic than a pure
 * controller, in that it moves items between lists, but this avoids having to
 * inherit a new model from ListModel, so different ListModels can be used as a
 * model for the view.
 *
 * @return RankingOrderController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/type'], function(extend,
    Controller, Type) {
  /**
   * Constructor
   *
   * @param view
   *          a valid RankingOrderView instance
   */
  function RankingOrderController(view) {
    var controller;

    RankingOrderController.superconstructor.call(this, view);

    controller = this;

    this.view.$view.find('button.move-left').click(function() {
      controller.unselect();
    });

    this.view.$view.find('button.move-right').click(function() {
      controller.select();
    });

    this.view.$view.find('button.move-down').click(function() {
      controller.movedown();
    });

    this.view.$view.find('button.move-up').click(function() {
      controller.moveup();
    });

    /*
     * Handle key presses on the left list
     */
    this.view.$selectedList.keydown(function(e) {
      switch (e.keyCode) {
      case 46: // Delete
      case 8: // Backspace
      case 127: // Delete (fallback)
        controller.unselect();
        controller.setSelectedIndex(0);
        e.preventDefault();
        return false;
      case 37: // Left arrow
        controller.view.$availableList.focus();
        e.preventDefault();
        return false;
      }
    });

    /*
     * Handle key presses on the right list
     */
    this.view.$availableList.keydown(function(e) {
      var value;
      switch (e.keyCode) {
      case 13: // Return
        value = controller.getAvailableValues();
        controller.select();
        controller.resetAvailableSelection(value[0]);
        e.preventDefault();
        return false;
      case 39: // Right Arrow
        controller.view.$selectedList.focus();
        e.preventDefault();
        return false;
      }
    });
  }
  extend(RankingOrderController, Controller);

  /**
   * get an array of selected values from the left list (Selection List)
   *
   * @return an array of value strings
   */
  RankingOrderController.prototype.getSelectedValues = function() {
    var value = this.view.$selectedList.val();

    if (value === null) {
      return [];
    }

    if (Type.isArray(value)) {
      return value;
    }
    return [value];
  };

  /**
   * Get the index of the first selected element on the left list
   *
   * @return
   */
  RankingOrderController.prototype.getSelectedIndex = function() {
    return this.view.$selectedList[0].selectedIndex;
  };

  /**
   * select/deselect a value on the right list (Available List)
   *
   * @param value
   *          Optional. The value to select. In undefined, deselect the current
   *          value
   */
  RankingOrderController.prototype.resetAvailableSelection = function(value) {
    if (value) {
      this.view.$availableList.val(value);
    } else {
      this.view.$availableList[0].selectedIndex = -1;
    }
  };

  /**
   * select the given index in the left list (Selection List)
   *
   * @param index
   *          the index to select. -1 to deselect.
   */
  RankingOrderController.prototype.setSelectedIndex = function(index) {
    this.view.$selectedList[0].selectedIndex = index;
  };

  /**
   * read the selected values from the right list (Available List)
   *
   * @return an array of values, which are selected in the right list. Empty
   *         array if nothing is selected
   */
  RankingOrderController.prototype.getAvailableValues = function() {
    var value = this.view.$availableList.val();

    if (value === null) {
      return [];
    }

    if (Type.isArray(value)) {
      return value;
    }
    return [value];
  };

  /**
   * move the selected items from the right list into the left list
   */
  RankingOrderController.prototype.unselect = function() {
    this.getSelectedValues().forEach(function(selectedComponent) {
      this.model.erase(selectedComponent);
      this.resetAvailableSelection(selectedComponent);
    }, this);
  };

  /**
   * move the selected item from the left list into the right list
   */
  RankingOrderController.prototype.select = function() {
    this.getAvailableValues().forEach(function(availableComponent) {
      this.model.push(availableComponent);
      this.setSelectedIndex(this.model.length - 1);
      this.resetAvailableSelection();
    }, this);
  };

  /**
   * move the selected item in the left list one place up
   */
  RankingOrderController.prototype.moveup = function() {
    var index, value;

    index = this.getSelectedIndex();
    if (index === -1 || index === 0) {
      return;
    }

    value = this.model.get(index);

    this.model.remove(index);
    this.model.insert(index - 1, value);
    this.setSelectedIndex(index - 1);
  };

  /**
   * move the selected item in the left list one place down
   */
  RankingOrderController.prototype.movedown = function() {
    var index, value;

    index = this.getSelectedIndex();
    if (index === -1 || index === this.model.length - 1) {
      return;
    }

    value = this.model.get(index);

    this.model.remove(index);
    this.model.insert(index + 1, value);
    this.setSelectedIndex(index + 1);
  };

  return RankingOrderController;
});
