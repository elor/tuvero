#!/bin/bash

set -e -u

if (( ${#@} != 1 )); then
    cat <<EOF>&2
Syntax: $(basename "$0") <target>
EOF
    exit 1
fi

target="$1"

cd build/ || exit 1

spritetmpfile=${target}_sprite_tmp.png
styletmpfile=${target}_style_tmp.png
scripttmpfile=${target}_script_tmp.js

requirescript=$target/scripts/require.js
mainscript=$target/scripts/main.js
favicon=$target/images/favicon.png
sprite=$target/images/sprite.png
stylesheet=$target/style/main.css

favicondata="data:image/png;base64,$(base64 -w0 $favicon)" || exit 1
spritedata="data:image/png;base64,$(base64 -w0 $sprite)" || exit 1

echo -ne "$spritedata" > $spritetmpfile || exit 1
sed -e 's/$//' \
    -e "/background-image/c background-image: url($spritedata);" \
    $stylesheet > $styletmpfile || exit 1
echo "</style>" >> $styletmpfile || exit 1
rm $spritetmpfile || exit 1

cat $requirescript $mainscript > $scripttmpfile || exit 1
echo "</script>" >> $scripttmpfile || exit 1

sed -i \
    -e "s#images/favicon.png#$favicondata#" \
    -e '/<link rel="stylesheet"/c<style>' \
    -e '/<script src="scripts\/main.js">/d' \
    -e '/<script src="scripts\/require.js">/c<script>' \
    $target/index.html || exit 1

sed -i \
    -e "/<style>/r $styletmpfile" \
    -e "/<script>/r $scripttmpfile" \
    $target/index.html || exit 1

sed  -i \
    -e '/^\s*$/d' $target/index.html || exit 1

rm $styletmpfile || exit 1
rm $scripttmpfile || exit 1

echo "$target/index.html compressed in place"
