#!/bin/bash
#
# optimizes the project (css, javascript and images)

####################################
# remove require.js debugging code #
####################################
sed -i '/<script>/,/<\/script>/d' *.html

#########################################
# optimize and copy to ../boules-build/ #
#########################################
rm -rf ../boules-build/
r.js -o scripts/build.js || exit 1

#########################################################################
# delete the now-optimized files and copy them from the build directory #
#########################################################################
rm style scripts -rf
cp -r ../boules-build/{scripts,style} .

########
# done #
########
