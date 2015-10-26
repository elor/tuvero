/**
 * SwissVotesView
 *
 * @return SwissVotesView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './boxview', './swissvotepropview',
    'core/propertyvaluemodel', 'core/classview'], function(extend, View,
    BoxView, SwissVotePropView, PropertyValueModel, ClassView) {
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

    this.votesenabled = new PropertyValueModel(this.model, 'enableupdown');
    this.hiddenclassview = new ClassView(this.votesenabled, this.$view,
        undefined, 'hidden');

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
          prop = $view.attr('class').replace(regex, '$2');
          return new SwissVotePropView(
              new PropertyValueModel(tournament, prop), $view);
        });
  };

  return SwissVotesView;
});
