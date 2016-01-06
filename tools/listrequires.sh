#!/bin/bash
#
# listing the dependencies of all listed files.
# If no files are listed, all source files are processed

set -e -u

exports=$(./tools/getexports.sh)
#grepstring=$(awk 'BEGIN {a=""} {a=a "|" $1} END {print a}' <<< "$exports" | sed -e 's/^|\(.*\)$/\\b(\1)\\b/' -e 's/\$/\\$/')

findscripts(){
    find core/scripts/ legacy/scripts/ -type f -name '*.js'
}

listrequires(){
    local file=$1
    #    local fileexport=$(grep $file'$' <<< "$exports" | awk '{print $1}')

    cat <<EOF | nodejs
function require(arg1, arg2) {
if (arguments.length < 2) {
console.log('NOTE: No modules loaded');
return 0;
} else if (arguments.length > 2) {
console.error('ERROR: Too many arguments');
return 1;
}

var modulenames = arg1;
var argumentnames = arg2.toString().replace(/(\/\/[^\n]*)?\n/g, ' ').replace(/{.*}/, '').replace(/\s/g, '').replace(/^function\(([^)]*)\)$/, '\$1').split(',');

if (modulenames.length != argumentnames.length) {
console.log('NOTE: Number of modules and arguments does not match. Variadic function?');
return 1
}

modules = modulenames.map(function(name, id) {
return [name, argumentnames[id]];
});

var exceptions = ['jquery', 'lib/FileSaver', 'ui/state_new']

modules.forEach(function(module){
console.log(module.join(' '));
if (module[0].replace(/^.*\//, '').toLowerCase() != module[1].toLowerCase() && exceptions.indexOf(module[0]) === -1) {
console.log('ERROR: Names do not match!');
}
})

};

require.config = function() {
console.log('NOTE: Config File')
};

var define = require;

$(cat $file)
EOF
return 0
}

getmoduledir(){
    local modulename=$(grep "$1\$" <<< "$exports" | awk '{print $2}')
    if [ -n "$modulename" ]; then
        echo "$(dirname "$modulename")/"
    else
#        echo "cannot find module '$1'" >&2
        echo './'
    fi
}

getsupermoduledir(){
    local modulename=$(getmoduledir "$1")
    if [ "$modulename" == "./" ]; then
        echo "../"
    else
        echo "$(dirname "$modulename")/"
    fi
}

processfile(){
    local file=$1

    echo "$file:"
    moduledir=$(getmoduledir "$file")
    supermoduledir=$(getsupermoduledir "$file")
    listrequires $file | sed -e "s#^\./#$moduledir#g" -e "s#^\.\./#$supermoduledir#g" | sed 's/^/  /'
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
