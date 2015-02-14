#!/bin/bash
#
# creates the appcache manifest under the assumption that there are no
# unnecessary files

listScripts(){
    find script* -name '*.js'
}

listImages(){
    find images -name '*.png'
    find images -name '*.gif'
}

listHTMLs(){
#    find * -name '*.html'
    ls *.html
}

listStylesheets(){
    find style* -name '*.css'
}

createManifest(){
    cat << EOF
CACHE MANIFEST
# Version: `[ -s Version ] && cat Version || echo dev`
# Date: `date`

# the boules program is purely offline
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

