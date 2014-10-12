#!/bin/bash
#
# optimizes the project (css, javascript and images)

buildscriptdir=`dirname "$0"`

######################
# update all scripts #
######################
"$buildscriptdir"/updatescripts.sh

####################################
# remove require.js debugging code #
####################################
sed -i '/<script>/,/<\/script>/d' *.html || exit 1

#####################################################
# combine all images and write the image stylesheet #
#####################################################
"$buildscriptdir"/writesprite.sh || exit 1

#########################################
# optimize and copy to ../boules-build/ #
#########################################
if ( "`readlink -f .`" == "`readlink -f ../boules-build`" ); then
    echo "cannot remove ../boules-build when it's the current working directory">&2
    exit 1
fi
rm -rf ../boules-build/ || exit 1
r.js -o "$buildscriptdir"/build.js || exit 1

#########################################################################
# delete the now-optimized files and copy them from the build directory #
#########################################################################
find images -type f -not -name '*.gif' -not -name 'sprite.png' -not -name 'games.png' -print0 | xargs -0 rm
find images -type d -not -path images -print0 | xargs -0 -n1 rmdir
rm style scripts -r
cp -r ../boules-build/{scripts,style} . || exit 1

########
# done #
########
