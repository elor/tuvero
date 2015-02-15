#!/bin/bash
#
# prepare a new distribution, including version pushing, building, directory replacements and cleanup

set -e -u

VERSION=$(cat Version)

./build-tools/apply-version.sh
git add -u
git add Version
git commit -m "release-$VERSION: version pushed"

make all
git add -u
git add manifest.appcache
git commit -m "release-$VERSION: targets built"

git rm boule tac test
git mv boule-build boule
git mv tac-build tac
git mv test-build test
git commit -m "release-$VERSION: source directories replaced with build directories"

make remove-dev-files
git add -u
git commit -m "release-$VERSION: build scripts and dev files removed"

echo "Release Build finished. See 'git log' for automatic commits"
