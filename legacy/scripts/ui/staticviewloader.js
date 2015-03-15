/**
 * Recursively traverse the DOM and initiate all non-template static views by a
 * class keyword, which is also used by the stylesheet. The applicable Views
 * have to be registered beforehand.
 *
 * In theory, a DOM element can have multiple views assigned.
 *
 * Templated views have to be initiated programmatically.
 *
 * @return StaticViewLoader
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['core/type'], function(Type) {
  var StaticViewLoader, views;

  views = {};

  /**
   * initiates the actual view
   *
   * @param $elem
   *          a jQuery element
   * @param classname
   *          the applicable class
   * @return nothing (i.e. undefined)
   */
  function loadViewByClass($elem, classname) {
    var View;

    View = views[classname];

    if (View) {
      new View($elem);
    }
  }

  /**
   * Matches the classes of a DOM element against the registered views. If an
   * applicable view is found, another instantiation function is called.
   *
   * @param $elem
   *          the jQUery element
   * @return nothing (i.e. undefined)
   */
  function checkAllClasses($elem) {
    var classes;

    classes = ($elem.attr('class') || '').split(/\s+/);

    $.each(classes, function(index, classname) {
      loadViewByClass($elem, classname);
    });
  }

  StaticViewLoader = {
    /**
     * register a view for later auto-assignment by the loadViews() function
     *
     * @param name
     *          the name of the view
     * @param constructor
     *          the constructor of the view, which only requires a jQuery
     *          element as an argument
     * @return StaticViewLoader
     */
    registerView: function(name, constructor) {
      if (!Type.isString(name) || !Type.isFunction(constructor)) {
        throw 'invalid argument types';
      }

      views[name] = constructor;

      return StaticViewLoader;
    },

    /**
     * Recursively assigns Views to DOM elements by their classes. Skips
     * elements with the class 'template'
     *
     * @param $elem
     *          the jQuery container element
     * @return StaticViewLoader
     */
    loadViews: function($elem) {

      if ($elem.hasClass('template')) {
        return;
      }

      checkAllClasses($elem);

      $elem.children().each(function(index, elem) {
        StaticViewLoader.loadViews($(elem));
      });

      return StaticViewLoader;
    }
  };

  return StaticViewLoader;
});
