$(function ($) {
  require([ 'tabs', 'toast' ], function (Tabs, Toast) {
    // debug toast
    new Toast("load");

    // initialize tabs and select first tab (hence the true)
    new Tabs('#tabs > div', 'images/%s.png', true);
  });
});
