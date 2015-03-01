#!/bin/bash
#
# creates the appcache manifest under the assumption that there are no
# unnecessary files

set -e -u

listScripts(){
    find  scripts -name '*.js' || true
}

listImages(){
    find images -name '*.png' || find * -name 'favicon.png'
    find images -name '*.gif' || true
}

listHTMLs(){
    ls *.html
}

listStylesheets(){
    find style -name '*.css' || true
}

createManifest(){
    cat << EOF
CACHE MANIFEST
# Version: `[ -s Version ] && cat Version || echo dev`
# Date: `date`

# tuvero is purely offline
CACHE:
`listHTMLs`
`listScripts`
`listImages`
`listStylesheets`

# allow player database updates
NETWORK:
http://*
https://*
*

EOF
}

######################
# write the manifest #
######################
manifest="manifest.appcache"
createManifest > $manifest

########################################
# apply the manifest to all html files #
########################################
# add manifest links to all html files
for file in `listHTMLs`; do
    relativepath=`sed -e 's:[^./]*/:../:g' -e 's:\(^\|/\)[^/]*$:\1:' <<< "$file"`
    sed -i '/<html/ s:manifest="[^"]*"::g' $file
    sed -i "/<html/ s:\s*>: manifest=\"$relativepath$manifest\">:" $file
done

