#!/bin/bash
#
# creates the common.js and test.js files

coredir=core/scripts
uidir=legacy/scripts/ui
backenddir=legacy/scripts/backend
timemachinedir=legacy/scripts/timemachine
libdir=lib

printrefs(){
    ( cd $2 && find * -type f -name '*.js' | grep -P '(^|/)test\/' | sort | sed -e 's/^/  '"'"$1'\//' -e 's/.js$/'"'"',/' )
}

cat <<EOF > test/scripts/test.js
/**
 * Run every available test
 *
 * This file is automatically created on build. Do not attempt manual changes
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
require(['config'], function() {
  require(['core/config'], function() {
    require(['core/common', 'qunit',
$(printrefs core $coredir)
$(printrefs backend $backenddir)
$(printrefs lib $libdir)
$(printrefs timemachine $timemachinedir)
$(printrefs ui $uidir | sed '$s/,$//')
], function(Common, QUnit) {
          var i;
          for (i = 2; i < arguments.length; i += 1) {
            try {
              arguments[i](QUnit, Common);
            } catch (e) {
              QUnit.test('Loading Error', function() {
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
EOF
