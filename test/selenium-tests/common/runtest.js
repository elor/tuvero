var webdriver = require('selenium-webdriver');

var driver = undefined;

function runAllTests(browserName) {
  process.argv.forEach(function(arg) {
    if (/^tests\//.test(arg)) {
      var test = require('../' + arg);
      var testname = arg.replace(/^tests\//, '').replace(/\.js$/, '');
      var prefix = browserName + '_' + testname + '_';
      var success = webdriver.promise.defer();

      success.then(function(yay) {
        console.log(testname + ': ' + (yay ? '   [OK]' : '[FAIL]'));
      });

      // reset the browser
      driver.get('about:blank');
      // open the location
      driver.get('file://' + process.cwd() + '../../../' + test.path);
      // run the test
      test.run(driver, prefix, function(yay) {
        success.fulfill(yay);
      });
      // reset the browser again
      driver.get('about:blank');
    }
  });
}

function testBrowser(browser) {
  driver = new webdriver.Builder().forBrowser(browser).build();

  driver.getCapabilities().then(function(caps) {
    runAllTests(caps.get('browserName'));
  });
  driver.quit().then(function() {
    driver = undefined;
  });

  return true;
}

webdriver.promise.controlFlow().on('uncaughtException', function(e) {
  console.error('Unhandled error: ' + e);
  if (driver) {
    driver.quit();
    driver = undefined;
  }
});

browser = process.env.SELENIUM_BROWSER;
console.log('testing ' + browser);
testBrowser(browser);
