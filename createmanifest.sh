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
  find * -name '*.html'
}

listPlainFiles(){
  find * -name '*.md'
  find * -name '*.txt'
  ls ChangeLog BUGS LICENSE NEWS TODO
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

# allow player database updates
NETWORK:
*

EOF

