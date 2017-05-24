QUnit.test("app test", function (assert) {
    var app = require('../app.js');

    assert.ok(app.secondFunction() === 'covered', 'covered is covered.');
});
