#!/bin/bash
###########################################################
# write license and author information to every code file #
###########################################################

set -e -u

listscripts(){
    find * -path 'build' -prune -or -path 'lib' -prune -or -type f -name '*.js' -not -name 'require.js' -not -name 'build.js' -not -name 'qunit.js' -print0
}

listscripts | xargs -0 fixjsstyle
