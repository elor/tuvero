define(['lib/extend', 'ui/tournamentview', 'ui/poulestournamentcontroller'],
  function (extend, TournamentView, PoulesTournamentController) {
    function PoulesTournamentView (model, $view, tournaments) {
      PoulesTournamentView.superconstructor.call(this, model, $view, tournaments)
      this.tournament = this.model.tournament

      this.$mode = this.$view.find('.tournamentoptions .option select.mode')
      this.$mode.val(this.tournament.getProperty('poulesmode'))

      this.$seed = this.$view.find('.tournamentoptions .option select.seed')
      this.$seed.val(this.tournament.getProperty('poulesseed'))

      this.$byepoules = this.$view.find('.tournamentoptions .option select.byepoules')
      this.$byepoules.val(this.tournament.getProperty('poulesbyepoules'))

      this.$byeteams = this.$view.find('.tournamentoptions .option select.byeteams')
      this.$byeteams.val(this.tournament.getProperty('poulesbyeteams'))

      this.$numpoulesinput = this.$view.find('input.numpoules')
      this.$numpoulestext = this.$view.find('.numpoulestext')
      this.$numbyepoulestext = this.$view.find('.numbyepoules')

      this.tournament.numpoules.registerListener(this)
      this.tournament.numbyepoules.registerListener(this)
      this.updateNumPoules()

      this.subcontroller = new PoulesTournamentController(this)
    }
    extend(PoulesTournamentView, TournamentView)

    PoulesTournamentView.prototype.updateNumPoules = function () {
      var numpoules, numbyepoules, minpoules, maxpoules

      minpoules = this.tournament.minPoules()
      maxpoules = this.tournament.maxPoules()
      numpoules = this.tournament.numpoules.get()
      numbyepoules = this.tournament.numbyepoules.get()

      this.$numpoulesinput.prop('min', minpoules)
      this.$numpoulesinput.prop('max', maxpoules)
      this.$numpoulesinput.val(numpoules)
      this.$numpoulesinput.prop('disabled', minpoules === maxpoules)

      this.$numpoulestext.text(numpoules)

      this.$numbyepoulestext.text(numbyepoules)

      this.$byepoules.prop('disabled', numbyepoules === 0 || numpoules === numbyepoules)
    }

    PoulesTournamentView.prototype.onupdate = function () {
      this.updateNumPoules()
    }

    return PoulesTournamentView
  })
