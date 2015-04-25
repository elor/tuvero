/**
 * Unit tests for ListModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var ListModel, ListUpdateListener;

    ListModel = getModule('core/listmodel');
    ListUpdateListener = getModule('core/listupdatelistener');

    QUnit.test('ListUpdateListener', function() {
      QUnit.ok(false, 'this test is still missing');
    });
  };
});
