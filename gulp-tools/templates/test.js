/**
 * Run every available test
 *
 * This file is automatically created on build. Do not attempt manual changes
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
require(['config'], function () {
    require(['core/config'], function () {
        var dependencies = ['core/common', 'qunit',
            { modules }
        ];
        require(dependencies, function (Common, QUnit) {
            var i, group, currentGroup;
            for (i = 2; i < arguments.length; i += 1) {
                try {
                    currentGroup = dependencies[i].match(/^[^/]+/)[0];
                    console.log(currentGroup);
                    if (group !== currentGroup) {
                        group = currentGroup;
                        QUnit.module(group);
                    }
                    arguments[i](QUnit, Common);
                } catch (e) {
                    QUnit.test('Loading Error', function () {
                        var source = e.stack.split('\n')[2].replace(/^ *at */, '')
                            .replace(/\?bust=[0-9]*/, '');
                        console.error(e.message);
                        console.error(source);
                        QUnit.ok(false, 'cannot load module ' +
                            e.message.match(/"[^"]+"/) + '. Possible typo?\n' +
                            source);
                    });
                }
            }
            QUnit.load();
            QUnit.start();
        });
    });
});