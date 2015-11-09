#!/bin/bash
#
# lists all exported objects from all scripts

set -e -u

listscripts(){
    find core/scripts/ legacy/scripts/ lib/ -type f -name '*.js' | sort
}

istest(){
    local file=$1
    grep -l '/test/' <<< $file &>/dev/null
}

ismodule(){
    local file=$1
    grep -l '^define(\' $file &>/dev/null
}

getexport(){
    local file=$1

    grep -B1 '^});' $file | sed -n 's#^\s*return\s*\([a-zA-Z]*\);$#\1#p' | grep -v '^undefined$'|| :
}

getmodule(){
    local file=$1

    echo "$file" | sed -e 's#\.js$##' -e 's#^core/scripts/#core/#' -e 's#^legacy/scripts/ui/#ui/#' -e 's#^lib/jquery#jquery#'
}

for file in $(listscripts); do
    exported=$(getexport $file)
    module=$(getmodule $file)
    if [ -n "$exported" ]; then
        echo "$exported $module $file"
    elif ! istest $file && ismodule $file; then
        echo "$module has no export!" >&2
    fi
done | column -t
