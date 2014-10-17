#!/bin/bash
##########################################
# apply the current version to all files #
##########################################

self="$0"

version=`cat Version || echo "dev"`
echo "pushing version $version"
sed -r -i "s/(\\\$|%)VERSION(\\\$|%)/$version/g" $file `git ls-files | grep -v images | grep -v "$self"`
