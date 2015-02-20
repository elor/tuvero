#!/bin/bash
#
# prepare a new distribution, including version pushing, building, directory replacements and cleanup

set -e -u

VERSION=$(cat Version)

./build-tools/reset-version.sh
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

cp build-tools/merge-master.sh .
make clean-shared-code clean-build-tools
git add -u
git commit -m "release-$VERSION: build scripts and dev files removed"

cat <<EOF
Release Build of version $VERSION finished.

Run 'git log' to see the auto-generated commits.

After validating the usability of the software, run './merge-master.sh' to merge this branch into the master branch prior to releasing it using 'git push' and 'git push --tags'

EOF

