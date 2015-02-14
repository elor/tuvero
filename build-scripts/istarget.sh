#!/bin/bash
##########################################
# apply the current version to all files #
##########################################

istarget(){
    local relpath=`git ls-tree --name-only --full-name HEAD index.html` || return 1
    relpath=${relpath%/index.html}
    [[ $relpath =~ ^[a-z]+$ ]]
}

if ! istarget; then
    echo "This script has to be run from inside a target directory, e.g. 'boule/'">&2
    exit 1
fi

version=`cat ../Version || echo "dev"`
echo "pushing version $version"
sed -r -i 's/($|%)VERSION($|%)/'$version'/g' index.html NEWS
