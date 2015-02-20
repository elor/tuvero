#!/bin/bash
##########################################
# apply the current version to all files #
##########################################

set -e -u

version=`cat Version || echo "dev-version"`
echo "resetting version $version"
sed -r -i 's/'$version'/%VERSION%/g' *.html */*.html README* legacy/scripts/ui/debug.js
