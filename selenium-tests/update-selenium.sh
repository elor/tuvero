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

latest=$(curl -s "$repo" | sed -r -n 's/.*<Key>([^>]*\/'$target'-([0-9]+\.?)+\.jar)<\/Key>.*/\1/p' | tail -1)
[ -n "$latest" ] || { echo "cannot read versions from repository">&2; exit 1; }

echo "downloading $repo$latest"

curl -q $repo$latest -o $(basename "$latest")

mv -v $target*.jar $target.jar

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
    file=$(basename "$latest")
    echo "downloading from $latest"
    curl -q "$latest" -o "$file"

    echo "extracting $file"
    unzip $file
done

echo
echo "chromedriver download and extraction successful"
echo
