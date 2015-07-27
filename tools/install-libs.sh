#!/bin/bash
#
# installs all js dependencies

set -e -u

bower=bower
if ! which $bower > /dev/null; then
    bower=./node_modules/bower/bin/bower
    if ! [ -e $bower ]; then
        which bower
    fi
    if ! [ -x $bower ]; then
        chmod +x $bower
    fi
fi

[ -d lib/ ] || { echo "cannot find lib/ folder">&2; exit 1; }

libs="Blob extend FileSaver jquery jsdiff modernizr typeahead.js elor/implements.js"

echo
echo "Downloading libraries..."
echo

$bower install $libs

[ -d "bower_components" ] || { echo "bower didn't create bower_components folder">&2; exit 1; }

echo
echo "Libraries downloaded. Locating library files..."
echo


libfiles=$(for f in bower_components/*; do
	libname=${f#bower_components/}
	libname=${libname%.js}
	libname=${libname#js}
	path=$(find $f -type f -name $libname.min.js)
	[ -z "$path" ] && path=$(find $f -type f -name $libname.js)
	echo $path
done)

[ -n "$libfiles" ] || { echo "cannot find library files">&2; exit 1; }

for filename in $libfiles; do
	target=$(basename $filename)
	target=${target/.min./.}
	mv -v $filename lib/$target
done

# TODO: also copy the license files

echo
echo "Removing download directory..."
rm -rf bower_components/

echo
echo "Libraries have been successfully installed"
