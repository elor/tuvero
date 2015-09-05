/**
 * ProgressTableView
 *
 * @return ProgressTableView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './listview', './teamtableview',
    './progressrowview'], function(extend, TemplateView, ListView,
    TeamTableView, ProgressRowView) {
  /**
   * Constructor
   */
  function ProgressTableView(model, $view, teamlist, teamsize) {
    ProgressTableView.superconstructor.call(this, model, $view, $view
        .find('.progressrow.template'));

    this.$table = this.$view.find('.progresstable');

    this.listView = new ListView(this.model.getTeams(), this.$table,
        this.$template, ProgressRowView, teamlist, this.model.getRanking());

    this.teamTableView = new TeamTableView(this.listView, teamsize);
  }
  extend(ProgressTableView, TemplateView);

  return ProgressTableView;
});
