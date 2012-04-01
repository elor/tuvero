function Ranking() {
  this.games = new Square();
  this.wins = new Square();
  this.netto = [];
}

Ranking.prototype.process = function() {
  var games = games.linesum();


  var ret = {
    netto: this.netto,
    wins: this.wins.linesum(),
    
  };

  return ret;
};

