#!/bin/bash
#
# update all version information, delete this file and commit your changes

# constants
manifest=manifest.appcache
self="$0"

# get the current version from the branch name
branch_name="$(git symbolic-ref HEAD 2>/dev/null)" ||
branch_name="(unnamed branch)"     # detached HEAD
branch_name=${branch_name##refs/heads/}
version=${branch_name##release-}

echo $version > Version
git add Version

./createmanifest.sh >$manifest
git add $manifest
# add manifest links to all html files
for file in `git ls-files '*.html'`; do
  sed -i -e "/<html/ s/\s*>/ manifest=\"$manifest\">/" $file
done
git add -u
git commit -m "release-$version: manifest generated and linked"

# remove debugging url arguments
for file in `git ls-files '*.html'`; do
  sed -i -e '/urlArgs: "bust="/d' $file
done

git add -u
git rm `git ls-files '*.sh' | grep -v "$self"`
git rm --cached $self
git commit -m "release-$version: debugging and build stuff removed"

# replace all %VERSION% and $VERSION$ placeholders
echo "pushing version $version"
IFS=$'\r\n'
for file in `git ls-files | grep -v images | grep -v "$self"`; do
  sed -i -e "s/\\\$VERSION\\$/$version/g" -e "s/%VERSION%/$version/g" $file
done

git add -u
git commit -m "release-$version: pushed to version $version"

git rm $self

git commit -m "release-$version: $self removed"

