#!/bin/bash
##########################################
# apply the current version to all files #
##########################################

version=`cat ../Version || echo "dev"`
echo "pushing version $version"
sed -r -i 's/($|%)VERSION($|%)/'$version'/g' *.html */*.html README* legacy/scripts/ui/debug.js NEWS
