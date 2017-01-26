/**
 * ServerTournamentView
 *
 * @return ServerTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/servertournamentcontroller'], function(
    extend, View, ServerTournamentController) {
  /**
   * Constructor
   */
  function ServerTournamentView(model, $view) {
    ServerTournamentView.superconstructor.call(this, model, $view);

    this.$view.find('.name').text(model.name);
    this.$view.find('.place').text(model.place);
    this.$view.find('.creator').text(model.creator);
    this.$view.find('.teamsize').text(model.teamsize);
    this.$view.find('.url_api').text(model.url_api);
    this.$view.find('.url_www').text(model.url_www);
    this.$view.find('a.url_href').attr('href', model.url_www);

    this.controller = new ServerTournamentController(this);
  }
  extend(ServerTournamentView, View);

  return ServerTournamentView;
});
