#!/bin/bash
##########################################
# apply the current version to all files #
##########################################

set -e -u

if (( ${#@} != 1 )); then
    cat <<EOF >&2
Syntax: $(basename "$0") <version>
EOF
    exit 1
fi

version="$1"

if [ -z "$version" ]; then
    echo "error: version string is empty" >&2
    exit 1
fi

if [[ "$version" =~ '\s' ]]; then
    echo "error: version string cannot contain spaces" >&2
    exit 1
fi

if [ -s Version ]; then
    previousversion=$(cat Version)
    echo "resetting version $previousversion"
    sed -r -i 's/'$previousversion'/%VERSION%/g' *.html */*.html README* legacy/scripts/ui/debug.js
fi

echo "pushing version $version"
sed -r -i 's/%VERSION%/'$version'/g' *.html */*.html README* legacy/scripts/ui/debug.js NEWS

echo "$version" > Version 
