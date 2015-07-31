#!/bin/bash
#
# download the selenium jar

set -e -u

target=selenium-server-standalone
repo=http://selenium-release.storage.googleapis.com/
libdir=lib/

rm -rvf $libdir
mkdir -vp $libdir
cd $libdir

latest=$(curl -s "$repo" | grep -Po '[^>]*/'$target'-([0-9]+\.?)+\.jar' | tail -1)
[ -n "$latest" ] || { echo "cannot read versions from repository">&2; exit 1; }
version=$( grep -Po '^[^/]+' <<< "$latest")

echo "downloading version $version from $repo"

wget $repo$latest

ln -s $target*.jar $target.jar

echo
echo "$target download successful"
echo
