#!/bin/bash
##############################################################
# Optimize JavaScript and CSS to reduce the number of files. #
# This incorporates r.js, a great requireJS optimizer        #
##############################################################

set -e -u

istarget(){
    local relpath=`git ls-tree --name-only --full-name HEAD index.html` || return 1
    relpath=${relpath%/index.html}
    [[ $relpath =~ ^[a-z]+$ ]]
}

if ! istarget; then
    echo "This script has to be run from inside a target directory, e.g. 'boule/'">&2
    exit 1
fi

target=$(basename $PWD)
builddir=../$target-build

###########################
# JavaScript optimization #
###########################

rm -rfv $builddir || exit 1
r.js -o scripts/build.js || exit 1
rm -f $builddir/build.txt $builddir/Makefile

#############################
# separate CSS optimization #
#############################

rm $builddir/style/*.css || exit 1
r.js -o cssIn=style/main.css out=$builddir/style/main.css || exit 1

#############################################################
# remove debug code from index.html and any other html file #
#############################################################

sed -i '/<script>/,/<\/script>/d' $builddir/*.html

########################
# remove unused images #
########################

find $builddir/images -type f -not -name sprite.png -not -name favicon.png  -print0 | xargs -0 -n1 rm -v || exit 1
# -not -name smallchange.png -> removed. Using a simple exclamation mark for now
find $builddir/images -type d -not -path $builddir/images -print0 | xargs -0 -n1 rmdir -v || exit 1

##############################################################
# createmanifest inside the build directory, for convenience #
##############################################################
manifestscript=`readlink -f ../build-tools/write-manifest.sh`
(
    cd $builddir || exit 1
    ../build-tools/write-manifest.sh
)
