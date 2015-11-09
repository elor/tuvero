#!/bin/bash
#
# listing the dependencies of all listed files.
# If no files are listed, all source files are processed

set -e -u

exports=$(./tools/getexports.sh)
grepstring=$(awk 'BEGIN {a=""} {a=a "|" $1} END {print a}' <<< "$exports" | sed -e 's/^|\(.*\)$/\\b(\1)\\b/' -e 's/\$/\\$/')

findscripts(){
    find core/scripts/ legacy/scripts/ -type f -name '*.js'
}

listdependencies(){
    local file=$1
    local fileexport=$(grep $file'$' <<< "$exports" | awk '{print $1}')

    grep -Po "$grepstring" $file | sort -u | grep -v "^$fileexport$"
}

processfile(){
    local file=$1

    echo "$file:"
    listdependencies $file | sed 's/^/  /'
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
