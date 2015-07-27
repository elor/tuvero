#!/bin/bash
#
# installs all js dependencies

set -e -u

which bower >/dev/null

[ -d lib/ ] || { echo "cannot find lib/ folder">&2; exit 1; }

libs="Blob extend FileSaver jquery jsdiff modernizr typeahead.js"

bower install $libs

[ -d "bower_components" ] || { echo "bower didn't create bower_components folder">&2; exit 1; }

libfiles=$(for f in bower_components/*; do
	libname=${f#bower_components/}
	libname=${libname%.js}
	libname=${libname#js}
	path=$(find $f -type f -name $libname.min.js)
	[ -z "$path" ] && path=$(find $f -type f -name $libname.js)
	echo $path
done)

[ -n "$libfiles" ] || echo 

for filename in $libfiles; do
	target=$(basename $filename)
	target=${target/.min./.}
	cp -v $filename lib/$target
done

echo "removing bower_components"
rm -rf bower_components/

echo
echo "libraries installed successfully"

