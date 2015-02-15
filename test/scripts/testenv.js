/**
 * builds a test environment
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['core/config'], function() {
  var TestEnv;

  TestEnv = function(func) {
    window.setTimeout(function() {
      TestEnv(func);
    }, 100);
  };

  require(['core/common', 'lib/jquery'], function(Common, $) {
    $ = require('jquery');

    TestEnv = function(func) {
      func(Common, $);
    };
  });

  return TestEnv;
});
