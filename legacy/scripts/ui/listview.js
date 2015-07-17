/**
 * ListView for printing data in a list using arbitrary views
 *
 * @return ListView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', './templateview', './textview'], function(extend,
    TemplateView, TextView) {
  /**
   * Constructor
   *
   * @param $view
   *          the jquery table object
   * @param model
   *          the ListModel instance
   * @param $template
   *          a template jQuery object, into which to insert the text of each
   *          element. Defaults to a <div>
   * @param SubView
   *          an object constructor for a View of the elements of the list.
   *          Default to TextView
   * @param ...
   *          arbitrary number of additional arguments, which are passed to the
   *          SubView constructor
   */
  function ListView(model, $view, $template, SubView) {
    var i;
    ListView.superconstructor.call(this, model, $view, $template);

    this.SubView = SubView || TextView;
    this.optArgs = [];
    this.subviews = [];

    for (i = 4; i < arguments.length; i += 1) {
      this.optArgs.push(arguments[i]);
    }

    this.update();
  }
  extend(ListView, TemplateView);

  /**
   * reset to an empty state
   */
  ListView.prototype.reset = function() {
    while (this.subviews.length > 0) {
      this.removeItem(0);
    }
  };

  /**
   * redraw everything
   */
  ListView.prototype.update = function() {
    var index;

    this.reset();

    for (index = 0; index < this.model.length; index += 1) {
      this.insertItem(index);
    }
  };

  /**
   * inserts an item into the ListView, using the constructor-specified SubView
   *
   * @param index
   *          the index of the item inside the underlying list
   */
  ListView.prototype.insertItem = function(index) {
    var $item, $subview, subview, model, $previousView, args;

    $subview = this.$template.clone();
    model = this.model.get(index);
    args = this.optArgs.slice(0);
    args.splice(0, 0, null, model, $subview);
    /*
     * Magic: this replaces 'new SubView(model, $subview, optArgs), but enables
     * the use of an arbitrary number of optional arguments
     */
    subview = new (Function.prototype.bind.apply(this.SubView, args));

    $item = subview.$view; // == $subview, but may have been wrapped by a
    // tag

    if (index === this.subviews.length) {
      this.$view.append($item);
    } else {
      $previousView = this.subviews[index].$view;
      $previousView.before($item);
    }
    this.subviews.splice(index, 0, subview);
  };

  /**
   * return the index of the DOM element, or -1
   *
   * @param $view
   *          the DOM element for which to look
   * @return the index of the DOM element inside the underlying list
   */
  ListView.prototype.indexOf = function($view) {
    var $parents, parentindex, index;

    // verify the descendance and ascend to the subview level of the DOM
    $parents = $view.parents();
    parentindex = $parents.index(this.$view);
    switch (parentindex) {
    case -1:
      console.warn('listview.indexOf: '
          + '$view is not a descendant of this.$view');
      return -1;
    case 0:
      // $view is a direct descendant of this.$view, i.e. child
      break;
    default:
      if (this.$template.prop('tagName') !== 'TBODY'
          && $parents.eq(parentindex - 1).prop('tagName') === 'TBODY') {
        // adjust parentindex if we have to step over an automatically inserted
        // tbody element. This is against the standard, but more intuitive
        parentindex -= 1;
        if (parentindex === 0) {
          // NOW, the parentindex is 0
          break;
        }
      }
      $view = $parents.eq(parentindex - 1);
      break;
    }

    /**
     * get the actual index
     */
    index = undefined;
    this.subviews.some(function(subview, subviewid) {
      // Note to self: cannot compare separate jQuery objects directly, but
      // their data() object is unique for each DOM element
      if (subview.$view.data() === $view.data()) {
        index = subviewid;
        return true;
      }
      return false;
    });

    if (index === undefined) {
      return -1;
    }
    return index;
  };

  /**
   * retrieve a subview
   *
   * @param index
   *          the index of the subview
   * @return undefined on failure, a subview reference on success
   */
  ListView.prototype.getSubview = function(index) {
    return this.subviews[index];
  };

  /**
   * remove the item from the DOM and remove all local references as well as its
   * subview
   *
   * @param index
   *          the index of the item upon removal
   */
  ListView.prototype.removeItem = function(index) {
    var subview;

    subview = this.subviews[index];

    if (subview) {
      subview.destroy();
      this.subviews.splice(index, 1);
    }
  };

  /**
   * Emitter Callback function, called right after a new element has been
   * inserted
   *
   * @param model
   *          the ListModel instance
   * @param event
   *          name of the event, i.e. 'insert'
   * @param data
   *          data object, containing at least the index within the list
   */
  ListView.prototype.oninsert = function(model, event, data) {
    this.insertItem(data.id);
  };

  /**
   * Emitter Callback function, called right after the removal of an element
   * from the list
   *
   * @param model
   *          the ListModel instance
   * @param event
   *          name of the event, i.e. 'remove'
   * @param data
   *          data object, containing at least the index within the list
   */
  ListView.prototype.onremove = function(model, event, data) {
    this.removeItem(data.id);
  };

  /**
   * Callback function, event emitted by list.clear()
   */
  ListView.prototype.onreset = function() {
    // Note to self: there should have been 'remove' events. This is just for
    // safety, in case I break the code in a strange way.
    this.reset();
  };

  return ListView;
});
