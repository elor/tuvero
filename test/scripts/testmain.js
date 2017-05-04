/**
 * prepares the test environment
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
require(['config'], function () {
    require(['core/config'], function () {
        require(['core/common', 'jquery'], TestMain(Common, $));
    });
});
