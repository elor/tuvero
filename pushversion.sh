#!/bin/bash
#
# update all version information, pack the files, all scripts and commit the changes

#############
# constants #
#############
self="$0"

################################################
# get the current version from the branch name #
################################################
branch_name="$(git symbolic-ref HEAD 2>/dev/null)" ||
branch_name="(unnamed branch)"     # detached HEAD
branch_name=${branch_name##refs/heads/}
version=${branch_name##release-}

echo $version > Version
git add Version

#####################################
# optimize the whole project folder #
#####################################
./optimize.sh
git add -u
git commit -m 'release-$version: optimized for deployment'

git rm `git ls-files '*.sh' | grep -v "$self"`
git rm --cached $self
git commit -m "release-$version: build/debugging scripts removed"

#######################
# update the manifest #
#######################
./manifest.sh
git add -u
git add manifest.appcache
git commit -m "release-$version: manifest generated and linked"

# replace all %VERSION% and $VERSION$ placeholders
echo "pushing version $version"
IFS=$'\r\n'
for file in `git ls-files | grep -v images | grep -v "$self"`; do
    sed -i -e "s/\\\$VERSION\\$/$version/g" -e "s/%VERSION%/$version/g" $file
done
# set release date in NEWS file
sed -i "1s/yyyy-mm-dd/`date +%F`/" NEWS

git add -u
git commit -m "release-$version: Version $version pushed"

rm $self
