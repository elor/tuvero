#!/bin/bash
#
# listing the dependencies of all listed files.
# If no files are listed, all source files are processed

set -e -u

#exports=$(./tools/getexports.sh)
#grepstring=$(awk 'BEGIN {a=""} {a=a "|" $1} END {print a}' <<< "$exports" | sed -e 's/^|\(.*\)$/\\b(\1)\\b/' -e 's/\$/\\$/')

findscripts(){
    find core/scripts/ legacy/scripts/ -type f -name '*.js'
}

extractmodulepaths(){
    sed -e 's/^\(require\|define\)(\[\(.*\)\],.*/\2/' -e "s/[,']//g" <<< "$1"
}

extractmodulenames(){
    sed -e 's/^\(require\|define\)(\[.*\],\s*function\s*(\(.*\))\s*{.*$/\2/' -e "s/[,']//g" <<< "$1"
}

listrequires(){
    local file=$1
#    local fileexport=$(grep $file'$' <<< "$exports" | awk '{print $1}')

    requires=$(sed -n '/require(\[\|define(\[/,/{/{p;/{/q}' $file | sed -e 's#//.*##' | paste -s -d '')
    if [ -n "$requires" ]; then
        extractmodulepaths "$requires"
        extractmodulenames "$requires"
    else
        emptydefine=$(sed -n '/^\s*define(function\s*()\s*{\s*$/{p;q}' $file)
        if [ -n "$emptydefine" ]; then
            echo "empty"
        else
            requireconfig=$(sed -n '/^require\.config({$/{p;q}' $file)
            if [ -n "$requireconfig" ]; then
                echo "config"
            else
                echo "ERROR: $file requires no modules!" >&2
            fi
        fi
    fi
}

processfile(){
    local file=$1

    echo "$file:"
    listrequires $file | sed 's/^/  /'
}

if (( ${#@} > 0 )); then
    for file in $@; do
        processfile $file
    done
else 
    # all files
    for file in $(findscripts); do
        processfile $file
    done
fi
