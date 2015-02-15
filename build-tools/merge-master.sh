#!/bin/bash
#
# merge this release branch with master

set -e -u

VERSION=$(cat Version)

git checkout master

git merge -X theirs release-$VERSION

git tag -a -m "Release $VERSION" $VERSION

echo "Finished merging branch release-$VERSION into branch master."
