function Ranking() {
  this.games = new Square();
  this.wins = [];
  this.netto = [];
}

Ranking.prototype.process = function() {
  var buchholz = this.games.multvec(this.wins);
  var feinbuchholz = this.games.multvec(buchholz);

  return {
    games: this.games.linesum(),
    wins: this.wins,
    buchholz: buchholz,
    feinbuchholz: feinbuchholz,
    netto: this.netto
  };
};

