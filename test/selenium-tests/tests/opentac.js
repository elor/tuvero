var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var writeScreenshot = require('../common/testtools.js').writeScreenshot;

exports.path = 'tac/index.html#reset';
exports.run = function(driver, prefix, success) {
  driver.wait(until.elementIsNotVisible(driver.findElement(By.id('splash'))),
      3000);
  driver.findElement(By.css('.tabmenu > a')).click();
  driver.wait(
      until.elementIsVisible(driver.findElement(By.css('#tabs > div'))), 500);
  driver.takeScreenshot().then(function(data) {
    writeScreenshot(data, prefix + '.png');
  }).then(function() {
    success(true);
  });
};
