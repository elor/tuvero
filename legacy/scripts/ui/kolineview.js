/**
 * KOLineView
 *
 * @return KOLineView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'jquery', './koline', './kotreeposition'], //
function(extend, View, $, KOLine, KOTreePosition) {
  /**
   * Constructor
   *
   * @param model
   *          a MatchResult instance
   * @param $view
   *          the container element
   * @param numTeams
   *          the total number of teams in the KO tournament
   */
  function KOLineView(model, $view, numTeams) {
    KOLineView.superconstructor.call(this, model, $view);

    this.numTeams = numTeams;

    if (this.model.getID() > 1) {
      this.$view.append(this.createLine());
    }
  }
  extend(KOLineView, View);

  /**
   * @param model
   *          a MatchModel instance
   * @param numTeams
   *          the total number of teams in the KO tournament
   * @return a jquery object of a KO line, ready to be inserted
   */
  KOLineView.prototype.createLine = function() {
    var line, from, to, pos;

    pos = new KOTreePosition(this.model.getID(), this.model.getGroup(),
        this.numTeams);

    this.x = pos.x;
    this.y = pos.y;

    pos = pos.getFollowingPosition();

    from = [this.x + KOTreePosition.WIDTH - 1, this.y + 2];
    to = [pos.x + 0.4, pos.y + 2];

    line = new KOLine(from, to);
    return $(line.svg).addClass('.koline');
  };

  return KOLineView;
});
