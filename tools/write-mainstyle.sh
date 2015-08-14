#!/bin/bash
#
# create core/style/mainstyle.css

set -e -u

dir=core/style
output=mainstyle.css

cd $dir

findcss(){
    find $@ -not -path ./$output -not -path $output -name '*.css' | sort
}

{
    findcss ../../lib/
    findcss *
    findcss ../../legacy/style/
} | sed -e 's_^./__' -e 's/^/@import url("/' -e 's/$/");/' > $output
