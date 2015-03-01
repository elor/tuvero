#!/bin/bash
#
# create core/style/mainstyle.css

set -e -u

dir=core/style
output=mainstyle.css

cd $dir

find * ../../legacy/style/* -not -path $output | sed -e 's/^/@import url("/' -e 's/$/");/' > $output
