#!/bin/bash
#
# merge this release branch with master

set -e -u

VERSION=$(cat Version)

git checkout master

git merge -X theirs release-$VERSION

git tag -a -m "Release $VERSION" $VERSION

echo "Branch release-$VERSION has been merged into master"
echo "Please verify the funcionality of the software before running "'`git push`'
echo "Also, don't forget to "'`git push --tags`'" to push the release tags"

rm -f merge-master.sh Makefile
