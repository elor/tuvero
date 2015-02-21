#!/bin/bash
#
# creates the common.js and test.js files

coredir=core/scripts
uidir=legacy/scripts/ui
backenddir=legacy/scripts/backend
libdir=lib

printrefs(){
    ( cd $2 && find * -type f -name '*.js' | sed -e 's/^/  '"'"$1'\//' -e 's/.js$/'"'"',/' | sed -e '/core\/common/d' -e '/core\/config/d' -e '/\/test\//d' )
}

cat <<EOF > core/scripts/common.js
/**
 * common.js: loads each requirejs-compatible script file (except tests)
 *
 * This file is automatically generated as part of the build process.
 * Do not attempt manual changes
 *
 * @return Common
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([
$(printrefs core $coredir)
$(printrefs backend $backenddir)
$(printrefs lib $libdir)
$(printrefs ui $uidir | sed '$s/,$//')
], function(undefined) {
  return function(str) {
    return require.s.contexts._.defined[str];
  };
});
EOF