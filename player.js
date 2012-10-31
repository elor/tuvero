function Player(init) {
  if (init) {
    switch (typeof init) {
    case 'string':
      this.fromString(init);
      break;
    case 'object':
      if (init.name)
      {
        this.name = init.name;
      }
      if (init.female)
      {
        this.female = true;
      }
      if (init.year) {
        this.year = Number(init.year);
      }
      if (init.city) {
        this.setCity(init.city);
      }
      if (init.assoc) {
        this.setAssoc(init.assoc);
      }
    }
  }

  this.id = Player.list.length;
  Player.list[this.id] = this;
}

Player.prototype = {
  name: 'noname',
  female: false,
  year: 1900,
  city: 0,
  assoc: 0
};

Player.list = [];
Player.cities = [''];
Player.assocs = [''];

// list of used strings as well as some handy functions
Player.consts = {
  female: 'f',
  male: '',
  separator: '\\',
  forbidden: /[\n\\]/g,
  replacement: '_',
  nonum: /(^\D*0|[\.,]\d+|\D)/g,  // I like regex: remove leading 0, all characters and fractions
  nostr: '',
  
  encode: function(string) {
    return string.replace(Player.consts.forbidden, Player.consts.replacement);
  },

  numdecode: function(string) {
    return string.replace(Player.consts.nonum, Player.consts.nostr);
  }
};

// serialize the player. see code or docs for the conversion scheme
Player.prototype.toString = function() {
  var year = [this.female ? Player.consts.female : Player.consts.male, this.year].join('');
  return [Player.consts.encode(this.name),
      year,
      Player.consts.encode(Player.cities[this.city]),
      Player.consts.encode(Player.assocs[this.assoc])
    ].join(Player.consts.separator);
};

// deserialize. see code or docs for conversion scheme
Player.prototype.fromString = function(string) {
  var val = string.split(Player.consts.separator);

  if (val[0]) {
    this.name = val[0];
  }

  if (Player.consts.female && val[1] && val[1][0] == Player.consts.female) {
    this.female = true;
  }

  if (val[1]) {
    this.year = Number(Player.consts.numdecode(val[1]));
  }

  if (val[2]) {
    this.setCity(val[2]);
  }

  if (val[3]) {
    this.setAssoc(val[3]);
  }

  return this;
};

Player.clear = function() {
  Player.list = [];
  Player.cities = [''];
  Player.assocs = [''];
};

Player.prototype.setCity = function(string) {
  switch (this.city = Player.cities.indexOf(string)) {
  case -1:
    this.city = Player.cities.length;
    Player.cities.push(string);
    break;
  case 0:
    delete this.city;
    break;
  }
};

Player.prototype.getCity = function() {
  return Player.cities[this.city];
};

Player.prototype.setAssoc = function(string) {
  switch(this.assoc = Player.assocs.indexOf(string)) {
  case -1:
    this.assoc = Player.assocs.length;
    Player.assocs.push(string);
    break;
  case 0:
    delete this.assoc;
    break;
  }
};

Player.prototype.getAssoc = function() {
  return Player.assocs[this.assoc];
};

Player.toString = function() {
  var length = Player.list.length;
  var lines = new Array;
  var i;

  if (!length) {
    return '';
  }

  for (i = 0; i < length; ++i) {
    lines.push(Player.list[i].toString());
  }

  return lines.join('\n');
};

Player.fromString = function(string) {
  Player.clear();

  if (!string) {
    return;
  }

  var lines = string.split('\n');
  var length = lines.length;
  var i;

  for (i = 0; i < length; ++i) {
    new Player(lines[i]);
  }
};

