#!/bin/bash
#
# listing the dependencies of all listed files.
# If no files are listed, all source files are processed

set -e -u

exports=$(./tools/getexports.sh)
grepstring=$(awk 'BEGIN {a=""} {a=a "|" $1} END {print a}' <<< "$exports" | sed -e 's/^|\(.*\)$/\\b(\1)\\b/' -e 's/\$/\\$/')

listdependencies(){
    local file=$1
    local fileexport=$(grep $file'$' <<< "$exports" | awk '{print $1}')

    circulardependencies=$(sed -n  's/^\s*\(\S\S*\)\s*=\s*\(require\|getModule\)(.*);\?$/\1/p' "$file" | paste -s -d '|' | sed 's/|/\\|/g')
    circulardependencies="^\($circulardependencies\)$"

    sed -e '1,/{/d' \
        -e 's#/\*.*\*/##g' \
        -e 's#/\S+\s*=\s*require(##g' \
        -e '/^\s*\/\*/,/\*\/\s*$/d' \
        -e 's/"[^"]*"//g' \
        -e "s/'[^']*'//g" \
        -e 's/\/\/.*$//' $file \
        | grep -Po "$grepstring" | sort -u | sed 's/\.//' | sort -u | grep -v "^$fileexport$" | grep -v "$circulardependencies"
}

findmodulename(){
    required=$(cat)
    
    for module in $required; do
        grep "\b$module\b" <<< "$exports"-*/* | awk '{print $2,$1}'
    done
}

processfile(){
    local file=$1

    echo "$file:"
    listdependencies $file | findmodulename | sort | sed 's/^/  /'
}

if (( ${#@} > 0 )); then
    for file in $@; do
        processfile $file
    done
else 
    # all files
    for file in $(./tools/listscripts.sh); do
        processfile $file
    done
fi
