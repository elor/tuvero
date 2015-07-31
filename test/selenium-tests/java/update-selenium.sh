#!/bin/bash
#
# download the selenium jar

set -e -u

libdir=lib/

rm -rvf $libdir
mkdir -vp $libdir
cd $libdir

echo
echo "downloading selenium"
echo

target=selenium-server-standalone
repo=http://selenium-release.storage.googleapis.com/

latest=$(curl -s "$repo" | grep -Po '[^>]*/'$target'-([0-9]+\.?)+\.jar' | tail -1)
[ -n "$latest" ] || { echo "cannot read versions from repository">&2; exit 1; }
version=$( grep -Po '^[^/]+' <<< "$latest")

echo "downloading version $version from $repo"

wget -q $repo$latest

ln -s $target*.jar $target.jar

echo
echo "$target download successful"
echo

echo
echo "downloading chromedriver"
echo

target=chromedriver
repo=http://chromedriver.storage.googleapis.com/
version=$(curl -s "$repo"LATEST_RELEASE)



for sys in win32 linux64; do

    latest="$repo$version/$target"_$sys.zip
    echo "downloading from $latest"
    wget -q "$latest"

    file=$(basename "$latest")
    echo "extracting $file"
    unzip $file
done

echo
echo "chromedriver download and extraction successful"
echo
