/**
 * KOLineView
 *
 * @return KOLineView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'jquery', 'ui/koline', 'ui/kotreeposition'], //
  function (extend, View, $, KOLine, KOTreePosition) {
    /**
     * Constructor
     *
     * @param model
     *          a MatchResult instance
     * @param $view
     *          the container element
     * @param numTeams
     *          the total number of teams in the KO tournament
     * @param fullwidth
     *          a ValueModel which evaluates to true if any name should be shown
     */
    function KOLineView (model, $view, numTeams, fullwidth) {
      KOLineView.superconstructor.call(this, model, $view)

      this.numTeams = numTeams
      this.fullwidth = fullwidth

      this.render()

      fullwidth.registerListener(this)
    }
    extend(KOLineView, View)

    KOLineView.prototype.clear = function () {
      if (this.$line) {
        this.$line.remove()
        this.$line = undefined
      }
    }

    KOLineView.prototype.render = function () {
      this.clear()

      if (this.model.getID() > 1) {
        this.$line = this.createLine()
        this.$view.append(this.$line)
      }
    }

    /**
     * @param model
     *          a MatchModel instance
     * @param numTeams
     *          the total number of teams in the KO tournament
     * @return a jquery object of a KO line, ready to be inserted
     */
    KOLineView.prototype.createLine = function () {
      var line, from, to, pos

      pos = new KOTreePosition(this.model.getID(), this.model.getGroup(),
        this.numTeams, this.fullwidth.get())

      this.x = pos.x
      this.y = pos.y

      pos = pos.getFollowingPosition()

      from = [this.x + KOTreePosition.getWidth(this.fullwidth.get()) - 1,
        this.y + 2
      ]
      to = [pos.x + 0.4, pos.y + 2]

      line = new KOLine(from, to)
      return $(line.svg).addClass('.koline')
    }

    KOLineView.prototype.onupdate = function (emitter, event, data) {
      this.render()
    }

    return KOLineView
  })
