function ArrayToString(arr) {
  var ret = [];
  var len = arr.length;
  var i;

  for (i = 0; i < len; ++i) {
    ret[i] = arr[i] || '';
  }

  return ret.join(' ').replace(/ +$/, '');
}

function ArrayFromString(string) {
  var tmp = string ? string.split(' ') : [];
  var ret = [];
  var len = tmp.length;
  var i;

  for (i = 0; i < len; ++i) {
    if (tmp[i]) {
      ret[i] = tmp[i];
    }
  }

  return ret;
}

