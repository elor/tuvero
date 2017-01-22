/**
 * ServerTournamentView
 *
 * @return ServerTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view'], function(extend, View) {
  /**
   * Constructor
   */
  function ServerTournamentView(model, $view) {
    ServerTournamentView.superconstructor.call(this, model, $view);

    this.$view.find('.name').text(model.name);
    this.$view.find('.place').text(model.place);
    this.$view.find('.creator').text(model.creator);
    this.$view.find('.teamsize').text(model.teamsize);
    this.$view.find('a.www_url').attr('href', model.url_www);
  }
  extend(ServerTournamentView, View);

  return ServerTournamentView;
});
