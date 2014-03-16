#!/bin/bash
#
# update all version information, delete this file and commit your changes

# get the current version from the branch name
branch_name="$(git symbolic-ref HEAD 2>/dev/null)" ||
branch_name="(unnamed branch)"     # detached HEAD
branch_name=${branch_name##refs/heads/}
version=${branch_name##release-}

# replace all %VERSION% and $VERSION$ placeholders
echo "pushing version $version"
IFS=$'\r\n'
for file in `git ls-files | grep -v images | grep -v pushversion.sh`; do
  sed -i -e "s/\\\$VERSION\\$/$version/g" -e "s/%VERSION%/$version/g" $file
done
git add -u

# remove debugging url arguments
for file in `git ls-files '*.html'`; do
  sed -i -e '/urlArgs: "bust="/d' $file
done

git rm pushversion.sh --cached

echo "committing changes"

git commit -m "pushed version $version"

rm pushversion.sh
