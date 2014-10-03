#!/bin/bash
#
# optimizes the project (css, javascript and images)

####################################
# remove require.js debugging code #
####################################
sed -i '/<script>/,/<\/script>/d' *.html || exit 1

#####################################################
# combine all images and write the image stylesheet #
#####################################################
./writesprite.sh || exit 1

#########################################
# optimize and copy to ../boules-build/ #
#########################################
rm -rf ../boules-build/ || exit 1
r.js -o scripts/build.js || exit 1

#########################################################################
# delete the now-optimized files and copy them from the build directory #
#########################################################################
find images -type f -not -name '*.gif' -not -name 'sprite.png' -not -name 'games.png' -print0 | xargs -0 rm
find images -type d -print0 | xargs -0 -n1 rmdir
rm style scripts -r
cp -r ../boules-build/{scripts,style} .

########
# done #
########
