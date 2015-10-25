/**
 * SwissVotesView
 *
 * @return SwissVotesView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './boxview', './swissvotepropview',
    'core/propertyvaluemodel', 'core/listener', 'core/classview'], function(
    extend, View, BoxView, SwissVotePropView, PropertyValueModel, Listener,
    ClassView) {
  /**
   * Constructor
   *
   * @param model
   *          a TournamentModel instance
   * @param $view
   *          the associated DOM element
   */
  function SwissVotesView(model, $view) {
    SwissVotesView.superconstructor.call(this, model, $view);

    this.boxview = new BoxView(this.$view.find('.boxview'));

    this.modevalue = new PropertyValueModel(this.model, 'swissmode');
    this.votesenabled = new PropertyValueModel(this.model, 'enableupdown');
    this.hiddenclassview = new ClassView(this.votesenabled, this.$view,
        'hidden');

    Listener.bind(this.modevalue, 'update', this.updateVisibility.bind(this));
    this.updateVisibility();

    this.initProps();
  }
  extend(SwissVotesView, View);

  /**
   * for every .prop subview, initiate a SwissVotePropView
   */
  SwissVotesView.prototype.initProps = function() {
    var tournament, regex;

    tournament = this.model;
    regex = /^(\S*\s)*(\S+after\S+)(\s\S*)*$/; // extract "XafterY" string
    this.$view.find('.prop').each(
        function() {
          var prop, $view;
          $view = $(this);
          prop = $view.attr('class').replace(regex, "$2");
          return new SwissVotePropView(
              new PropertyValueModel(tournament, prop), $view);
        });
  };

  /**
   * FIXME this doesn't belong into a view. Maybe move it into a Controller The
   * whole SwissVotesView should only be visible when working with wingroups
   */
  SwissVotesView.prototype.updateVisibility = function() {
    this.votesenabled.set(this.modevalue.get() !== 'wins');
    if (!this.votesenabled.get()) {
      this.model.setProperty('byeafterbye', false);
    }
  };

  return SwissVotesView;
});
