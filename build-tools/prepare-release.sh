#!/bin/bash
#
# prepare a new distribution, including version pushing, building, directory replacements and cleanup

set -e -u

getreleaseversion(){
    local branch_name="$(git symbolic-ref HEAD 2>/dev/null | xargs basename)"
    if [ "$branch_name" ]; then
        echo "error: cannot prepare a release on a detached head. Need a release-### branch" >&2
        exit 1
    fi

    local version=${branch_name##release-}
    if [ "$version" == "$branch_name" ]; then
        echo "error: current branch is not a release branch: '$branch_name'" >&2
        exit 1
    fi

    echo $version
}

VERSION=$(cat Version)

./build-tools/apply-version.sh "$VERSION"
git add -u
git commit -m "release-$VERSION: version pushed"

make all
git add -u
git add *-build/manifest.appcache
git commit -m "release-$VERSION: targets built"

git rm -r core legacy lib
git rm -r boule tac test
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

