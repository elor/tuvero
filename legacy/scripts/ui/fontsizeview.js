/**
 * Font Size View: A widget for controlling the font size.
 *
 * The FontSizeModel is unique for every DOM element and can be retrieved and
 * controlled using a static function.
 *
 * TODO allow for arbitrary font sizes
 *
 * @return FontSizeView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './fontsizecontroller',
    './fontsizemodel'], function(extend, View, FontSizeController,
    FontSizeModel) {
  var classprefix;

  classprefix = 'fontsize';

  /**
   * Constructor, which also calls update() for the first time
   *
   * @param $view
   *          the container of the widget
   * @param $container
   *          the container of the size-adjusted text. If undefined, it defaults
   *          to <body>
   */
  function FontSizeView($view, $container) {
    $container = $container || $('body');

    FontSizeView.superconstructor.call(this, FontSizeView
        .getModelOfContainer($container), $view);

    this.$container = $container;

    this.update();

    this.controller = new FontSizeController(this);
  }
  extend(FontSizeView, View);

  /**
   * removes all font size information
   */
  FontSizeView.prototype.reset = function() {
    var $container = this.$container;
    FontSizeModel.SIZES.map(function(size) {
      $container.removeClass(classprefix + size);
    });
  };

  /**
   * sets the current font size, as defined by the model
   */
  FontSizeView.prototype.update = function() {
    this.reset();
    this.$container.addClass(classprefix + this.model.getFontSize());
  };

  /**
   * model.emit() callback function
   */
  FontSizeView.prototype.onupdate = function() {
    this.update();
  };

  /**
   * Retrieves the model for the given container. Allocates a new FontSizeModel,
   * if not set yet.
   *
   * @param $container
   *          the container
   * @return the model for the given container
   */
  FontSizeView.getModelOfContainer = function($container) {
    if (!$container.data('FontSizeModel')) {
      $container.data('FontSizeModel', new FontSizeModel());
    }

    return $container.data('FontSizeModel');
  };

  return FontSizeView;
});
