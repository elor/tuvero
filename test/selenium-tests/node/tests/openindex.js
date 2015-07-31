var writeScreenshot = require('../common/testtools.js').writeScreenshot;

exports.path = 'index.html';
exports.run = function(driver, prefix, success) {
  driver.takeScreenshot().then(function(data) {
    writeScreenshot(data, prefix + '.png');
  }).then(function() {
    success(true);
  });
};
