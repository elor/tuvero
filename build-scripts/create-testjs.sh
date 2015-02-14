#!/bin/bash
#
# creates the common.js and test.js files

coredir=core/scripts
uidir=legacy/scripts/ui
backenddir=legacy/scripts/backend
libdir=lib

printrefs(){
    ( cd $2 && find * -type f -name '*.js' | grep -P '(^|/)test\/' | sed -e 's/^/  '"'"$1'\//' -e 's/.js$/'"'"',/' )
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
$(printrefs ui $uidir)
], function(Common, QUnit) {
          var i;
          for (i = 2; i < arguments.length; i += 1) {
            arguments[i](QUnit, Common);
          }
          QUnit.load();
          QUnit.start();
        });
  });
});
EOF
