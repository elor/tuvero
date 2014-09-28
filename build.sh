#!/bin/bash
#
# "builds" the project using r.js

##################################
# remove any old build directory #
##################################
rm -rf ../boules-build/

#########################
# remove manifest stuff #
#########################
sed -i '/<script>/,/<\/script>/d' *.html

#########################################
# optimize and copy to ../boules-build/ #
#########################################
r.js -o scripts/build.js
