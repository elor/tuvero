#!/bin/bash

set -e -u

if (( ${#@} != 1 )); then
    cat <<EOF>&2
Syntax: $(basename "$0") <target>
EOF
    exit 1
fi

target="$1"

cd build/

spritetmpfile=${target}_sprite_tmp.png
styletmpfile=${target}_style_tmp.png
scripttmpfile=${target}_script_tmp.js

requirescript=$target/scripts/require.js
mainscript=$target/scripts/main.js
favicon=$target/images/favicon.png
sprite=$target/images/sprite.png
stylesheet=$target/style/main.css

favicondata="data:image/png;base64,$(base64 -w0 $favicon)"
spritedata="data:image/png;base64,$(base64 -w0 $sprite)"

echo -ne "$spritedata" > $spritetmpfile
sed -e 's/$//' \
    -e "/background-image/c background-image: url($spritedata);" \
    $stylesheet > $styletmpfile
echo "</style>" >> $styletmpfile
rm $spritetmpfile

cat $requirescript $mainscript > $scripttmpfile
echo "</script>" >> $scripttmpfile

sed \
    -e "s#images/favicon.png#$favicondata#" \
    -e '/<link rel="stylesheet"/c<style>' \
    -e '/<script src="scripts\/main.js">/d' \
    -e '/<script src="scripts\/require.js">/c<script>' \
    $target/index.html \
    | sed -e "/<style>/r $styletmpfile" \
    -e "/<script>/r $scripttmpfile" \
    | sed -e '/^\s*$/d' \
    > $target.html

rm $styletmpfile
rm $scripttmpfile

echo "$target/ compressed into $target.html"
