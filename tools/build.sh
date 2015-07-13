#!/bin/bash
##############################################################
# Optimize JavaScript and CSS to reduce the number of files. #
# This incorporates r.js, a great requireJS optimizer        #
##############################################################

set -e -u

rjs=r.js
if ! which $rjs > /dev/null; then
    rjs=node_modules/r.js/r.js
    if [ -e $rjs ]; then
        which r.js
    fi
fi

if (( ${#@} != 1 )); then
    echo "Syntax: $(basename $0) <target>" >&2
    exit 1
fi

istarget(){
    local dir="$1"
    [[ "$dir" =~ ^[a-z]+$ ]] || return 1
    [ -d $dir ] || return 1
    [ -f $dir/index.html ] || return 1
    [ -f $dir/scripts/build.js ] || return 1
    [ -f $dir/style/main.css ] || return 1
    return 0
}

sourcedir="$1"

if ! istarget "$sourcedir"; then
    echo "This script has to be run from inside a target directory, e.g. 'boule/'">&2
    exit 1
fi

target=$sourcedir
builddir=build/$target
[ -d build ]

###########################
# JavaScript optimization #
###########################

rm -rfv $builddir || exit 1
$rjs -o $sourcedir/scripts/build.js || exit 1
rm -rf $builddir/templates/ || :
rm -f $builddir/build.txt $builddir/Makefile $builddir/scripts/strings.js

#############################
# separate CSS optimization #
#############################

rm $builddir/style/*.css || exit 1
$rjs -o cssIn=$sourcedir/style/main.css out=$builddir/style/main.css || exit 1

#############################################################
# remove debug code from index.html and any other html file #
#############################################################

sed -i '/<script>/,/<\/script>/d' $builddir/*.html

########################
# remove unused images #
########################

find $builddir/images -type f -not -name sprite.png -not -name favicon.png  -print0 | xargs -0 -n1 rm -v || exit 1
# -not -name smallchange.png -> removed. Using a simple exclamation mark for now
find $builddir/images -type d -not -path $builddir/images -print0 | xargs -0 -n1 rmdir -v || echo "rmdir: tolerating missing operand"

##############################################################
# createmanifest inside the build directory, for convenience #
##############################################################
echo "creating manifest"
./tools/write-manifest.sh $builddir

echo "Done: $builddir"
