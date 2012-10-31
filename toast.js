var Toast = function(str, seconds){
  seconds = seconds || 2;
  Toast.pending.push({str: str, seconds: seconds});
};

Toast.pending = [];

$(function($) {
  var fadein = 200;
  var fadeout = 200;

  var toastfunc = function(str, seconds) {
    seconds = seconds || 2;
    var $toasts = $('#toasts');
    var $div = $('<div></div>');
    var $br = $('<br>');

    if (typeof str == 'string') {
      $div.text(str);
    } else {
      $div.append(str);
    }
    $toasts.append($div);
    $div.after($br);

    window.setTimeout(function() {
      $div.addClass('toast');
    }, 10);

    window.setTimeout(function() {
      $div.removeClass('toast');
    }, 1000 * seconds + fadein);

    window.setTimeout(function() {
      $br.remove();
      $div.remove();
    }, 1000 * seconds + fadein + fadeout);

  };

  var tmp;

  while (Toast.pending && Toast.pending.length) {
    tmp = Toast.pending.shift();
    toastfunc(tmp.str, tmp.seconds);
  }

  Toast = toastfunc;

  var text = ['lorem ipsum', 'dolor sit amet', 'blablabla'];
});

