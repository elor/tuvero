function Map () {
  this.map = [];
}

Map.prototype.add = function(global) {
  var local = this.getLocal(global);

  if (local == -1) {
    local = map.length;
    map[] = global;
  }

  return local;
};

Map.prototype.getGlobal(local) {
  var ret = this.map[local];
  if (ret == undefined) {
    return -1;
  }

  return this.map[local];
}

Map.prototype.getLocal(global) {
  return map.indexof(global);
}

