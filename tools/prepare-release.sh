#!/bin/bash
#
# prepare a new distribution, including version pushing, building, directory replacements and cleanup

set -e -u

getreleaseversion(){
    local branch_name="$(git symbolic-ref HEAD 2>/dev/null | xargs basename)"
    if [ -z "$branch_name" ]; then
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

VERSION=$(getreleaseversion)

#######################
# set the new version #
#######################
./tools/apply-version.sh "$VERSION"
git add -u
git commit -m "release-$VERSION: version pushed"

######################
# build every target #
######################
make build
git add -u
git add -f build
git commit -m "release-$VERSION: targets built"

###################################
# remove the original source code #
###################################
git rm -r core legacy lib
git rm -r boule tac test *.html
git commit -m "release-$VERSION: source directories removed"

############################################################
# replace the now-deleted source code with the built files #
############################################################
git mv build/* .
git commit -m "release-$VERSION: source directories replaced with build directories"

####################
# remove dev tools #
####################
cp tools/merge-master.sh .
make clean-tools
git add -u
git commit -m "release-$VERSION: build scripts and dev files removed"

########
# done #
########
cat <<EOF
Release Build of version $VERSION finished.

Run 'git log' to see the auto-generated commits.

After validating the usability of the software, run './merge-master.sh' to merge this branch into the master branch prior to releasing it using 'git push' and 'git push --tags'

EOF

