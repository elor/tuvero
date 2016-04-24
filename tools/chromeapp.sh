#!/bin/bash
#
# create a chromeapp from the built project

set -e -u

if (( ${#@} != 1 )); then
    cat <<EOF
Syntax: $(basename "$0") <target>
EOF
    exit 1
fi

target=$1
version=$(cat build/Version | grep -o '\([0-9]\|\.\)\+')
variant=$(grep 'variant:' $target/scripts/strings.js | sed "s/.*'\([^']\+\)'.*/\1/")

echo "creating chromeapp for target: $target $version, name: Tuvero $variant"

mkdir -p ./build-chromeapp/$target
echo "chromeapp directory './build-chromeapp/$target' created"

sed -e "s/%variant%/$variant/" \
    -e "s/%version%/$version/" \
    core/chromeapp/manifest.json > ./build-chromeapp/$target/manifest.json

echo "manifest.json created"

sed -e '/<script>/i<script src="script.js"></script>' \
    -e '/<script>/,/<\/script>/d' \
    -e 's/ manifest="manifest.appcache"//' \
    -e '/^\s*$/d' \
    build/$target/index.html > ./build-chromeapp/$target/index.html
echo "index.html created"

sed -e 's#</\?script>#\n&\n#' build/$target/index.html \
    | sed -e '1,/<script>/d' \
    -e '/<\/script>/,$d' \
    -e '/^\s*$/d' \
    > ./build-chromeapp/$target/script.js
echo "script.js created created"

cp core/chromeapp/background.js ./build-chromeapp/$target/background.js
echo "background.js copied"

cp $target/images/favicon.png ./build-chromeapp/$target/tuvero-128.png
echo "tuvero-128.png copied from favicon"
convert -scale 0.25 ./build-chromeapp/$target/tuvero-{128,32}.png
echo "tuvero-32.png downscaled from tuvero-128.png"

echo "chromeapp 'Tuvero $variant $version' created under ./build-chromeapp/$target/"
