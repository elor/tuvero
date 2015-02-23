/**
 * builds a test environment
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
require(['config'], function() {
  require(['core/config'], function() {
    require(['core/common', 'lib/jquery'], function(Common, $) {
      $ = require('jquery');
      TestMain(Common, $);
    });
  });
});
