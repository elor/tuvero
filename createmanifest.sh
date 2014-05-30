#!/bin/bash
#
# creates the appcache manifest under the assumption that there are no
# unnecessary files

listScripts(){
  find script* -name '*.js'
}

listImages(){
  find images -name '*.png'
}

listHTMLs(){
  ls *.html
}

listPlainFiles(){
  find * -name '*.md'
  find * -name '*.txt'
}

listStylesheets(){
  find style* -name '*.css'
}

cat << EOF
CACHE MANIFEST
# Version: `cat Version`
# Date: `date`

# the boules program is purely offline
CACHE:
`listHTMLs`
`listScripts`
`listImages`
`listPlainFiles`
`listStylesheets`

EOF

