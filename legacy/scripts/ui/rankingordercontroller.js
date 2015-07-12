/**
 * RankingOrderController
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

    this.view.$view.find("button.move-left").click(function() {
      controller.moveleft();
    });

    this.view.$view.find("button.move-right").click(function() {
      controller.moveright();
    });

    this.view.$view.find("button.move-down").click(function() {
      controller.movedown();
    });

    this.view.$view.find("button.move-up").click(function() {
      controller.moveup();
    });

    this.view.$selectedList.keyup(function(e) {
      switch (e.keyCode) {
      case 46: // Delete
      case 8: // Backspace
      case 127: // Delete (fallback)
        controller.moveright();
        controller.setSelectedIndex(0);
        break;
      case 39: // Right arrow
        controller.view.$availableList.focus();
        break;
      }
    });

    this.view.$availableList.keyup(function(e) {
      var value;
      switch(e.keyCode) {
      case 13: // Return
        value = controller.getAvailableValues();
        controller.moveleft();
        controller.resetAvailableSelection(value[0]);
        break;
      case 37: // Left Arrow
        controller.view.$selectedList.focus();
      }
    });
  }
  extend(RankingOrderController, Controller);

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

  RankingOrderController.prototype.getSelectedIndex = function() {
    return this.view.$selectedList[0].selectedIndex;
  };

  RankingOrderController.prototype.resetAvailableSelection = function(value) {
    if (value) {
      this.view.$availableList.val(value);
    } else {
      this.view.$availableList[0].selectedIndex = -1;
    }
  };

  RankingOrderController.prototype.setSelectedIndex = function(index) {
    this.view.$selectedList[0].selectedIndex = index;
  };

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

  RankingOrderController.prototype.moveleft = function() {
    this.getAvailableValues().forEach(function(availableComponent) {
      this.model.push(availableComponent);
      this.setSelectedIndex(this.model.length - 1);
      this.resetAvailableSelection();
    }, this);
  };

  RankingOrderController.prototype.moveright = function() {
    this.getSelectedValues().forEach(function(selectedComponent) {
      this.model.erase(selectedComponent);
      this.resetAvailableSelection(selectedComponent);
    }, this);
  };

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
