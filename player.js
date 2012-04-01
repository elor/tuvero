function Player() {
// fill the player fields with valid stuff. To fill it with real data, read 
// fromString() below
  this.name = Player.strings.name;
  this.female = false;
  this.year = 1900;
  this.city = Player.strings.city;
  this.association = Player.strings.association;
}

// list of used strings as well as some handy functions
Player.strings = {
  name: 'noname',
  female: 'f',
  male: '',
  city: 'nowhere',
  association: 'none',
  separator: '\\',
  forbidden: /[\n\\]/g,
  replacement: '_',
  nonum: /(^\D*0|[\.,]\d+|\D)/g,  // I like regex: remove leading 0, all characters and fractions
  nostr: '',
  
  encode: function(string) {
    return string.replace(Player.strings.forbidden, Player.strings.replacement);
  },

  numdecode: function(string) {
    return string.replace(Player.strings.nonum, Player.strings.nostr);
  }
};

// 
Player.prototype.toString = function() {
  var year = [this.female ? Player.strings.female : Player.strings.male, this.year].join('');
  return [Player.strings.encode(this.name),
      year,
      Player.strings.encode(this.city),
      Player.strings.encode(this.association)
    ].join(Player.strings.separator);
};

// read 
Player.prototype.fromString = function(string) {
  var val = string.split(Player.strings.separator);

  this.name = val[0] || Player.strings.name;

  //  
  if (Player.strings.female && val[1] && val[1][0] == Player.strings.female) {
    this.female = true;
  }
  if (Player.strings.male && val[1] && val[1][0] == Player.strings.male) {
    this.female = false;
  }

  this.year = Number(Player.strings.numdecode(val[1]));
  this.city = val[2] || Player.strings.city;
  this.association = val[3] || Player.strings.association;

  return this;
}

