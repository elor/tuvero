QUnit.test("app test", function (assert) {
    assert.ok(1 === 1, 'stupid test');

    var app = require('../app.js');
    assert.equal(app.do(1, 1), 2, '1 + 1');
    assert.equal(app.do(5, 8), 13, '5 + 8');
});
