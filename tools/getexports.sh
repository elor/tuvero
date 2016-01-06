#!/bin/bash
#
# lists all exported objects from all scripts

set -e -u

listscripts(){
    find core/scripts/ legacy/scripts/ lib/ -type f -name '*.js' | sort
}

islib(){
    local file=$1
    grep '^lib/' <<< $file &>/dev/null
}

istest(){
    local file=$1
    grep '/test/' <<< $file &>/dev/null
}

ismodule(){
    local file=$1
    grep -l '^define(\' $file &>/dev/null || islib $file
}

getexport(){
    local file=$1

    exported=$(grep -B1 '^});' $file | sed -n 's#^\s*return\s*\([a-zA-Z]*\);$#\1#p' | grep -v '^undefined$'|| :)
    [ -z "$exported" ] && exported=$(grep -o '^var [a-zA-Z]*' $file | sed -e 's/var //')
    [ -z "$exported" ] && islib $file && exported=$(basename $file | sed 's/\.js$//')
    echo "$exported"
}

getmodule(){
    local file=$1

    echo "$file" | sed -e 's#\.js$##' \
        -e 's#^core/scripts/#core/#' \
        -e 's#^legacy/scripts/backend/#backend/#' \
        -e 's#^legacy/scripts/ui/#ui/#' \
        -e 's#^lib/jquery#jquery#'
}

{
    for file in $(listscripts); do
        {
            exported=$(getexport $file)
            module=$(getmodule $file)
            if [ -n "$exported" ]; then
                echo "$exported $module $file"
            elif ! istest $file && ismodule $file; then
                echo "$module has no export!" >&2
            fi
        } &
    done

    echo Options options options.js
    echo Presets presets presets.js
} | sort -k2,2 | column -t
