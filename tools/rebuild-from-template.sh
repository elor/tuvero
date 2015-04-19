#!/bin/bash
##########################################
# apply the current version to all files #
##########################################

set -e -u

templatedir="../core/templates/"
stringfile="scripts/strings.js"

if [ -d "$templatedir" ] && [ -f "$stringfile" ]; then
    :
#     cat <<EOF
# templatedir: $templatedir
# stringfile: $stringfile
# EOF
else
    cat <<EOF
This file has to be run from inside a build target directory, e.g. boule/ or tac/
EOF
    exit 1
fi

getstring(){
    local key
    local value
    key="$1"
    value=$(sed -r -n "s/\s*$1\s*:\s*('[^']+'|\"[^\"]+\")\s*,?\s*/\1/p" "$stringfile")
    value=$(sed -r "s/^['\"]\s*|\s*['\"]$//g" <<< "$value")

    (( $(wc -l <<< "$value") > 1 )) && echo "$stringfile: multiple entries of '$key'" >&2

    cat <<< "$value"
}

replacestrings(){
    local string
    local keys
    local value

    string=$(cat)

    keys=$(grep -oP '%[a-z]+%' <<< "$string" | sed -r "s/%//g" | sort -u)

    for key in $keys; do
        value="$(getstring $key)"

        [ -z "$value" ] && continue

        string=$(sed "s/%$key%/$value/g" <<< "$string")
    done

    cat <<< "$string"
}

inserttemplate(){
    local file="$templatedir/$1.html"
    local lineprefix
    if (( ${#@} > 1 )); then
        lineprefix="$2"
    else
        lineprefix=''
    fi

    if ! [ -f "$file" ]; then
        echo "ERROR: missing template '$file' ($1)" >&2
        exit 1
    fi

    cat "$file" | while IFS= read line; do
        local key=$(sed -r -n 's/^\s*\{\{([a-z]+)\}\}\s*$/\1/p' <<< "$line")
        if [ -n "$key" ]; then
            local subprefix=$(grep -Po '^\s*' <<<"$line")
            inserttemplate $key "$lineprefix$subprefix"
            # insert sub-template
            # TODO abort on infinite recursion
        else
            # show the current line
            cat <<< "$lineprefix$line"
        fi
        
    done
}

stripspaces(){
    sed 's/\s*$//'
}

inserttemplate index | replacestrings | stripspaces > index.html

exit 0
