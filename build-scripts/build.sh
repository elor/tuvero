#!/bin/bash
#########################################################
# optimize JavaScript and CSS for least number of files #
# This incorporates r.js, the great requireJS optimizer #
#########################################################

#########################################
# optimize and copy to ../boules-build/ #
#########################################
if ( "`readlink -f $PWD`" == "`readlink -f ../boules-build`" ); then
    echo "cannot build when boules-build is the working directory">&2
    exit 1
fi
rm -rf ../boules-build/ || exit 1
r.js -o build-scripts/build.js || exit 1

#########################################################################
# delete the now-optimized files and copy them from the build directory #
#########################################################################
rm style scripts -r
cp -r ../boules-build/{scripts,style} . || exit 1

##############################################################
# createmanifest inside the build directory, for convenience #
##############################################################
manifestscript=`readlink -f build-scripts/manifest.sh`
(
    cd ../boules-build || exit 1
    "$manifestscript"
)
