#!/bin/bash
#
# reads glossary.txt and writes it into glossary.html

sed -i '/<h1/,/<\/body/ { /<h1/b; /<\/body/b; d }' glossary.html

txt2html(){
    sed -e '/^\s*$/d' \
        -e 's/</\&lt;/g' \
        -e 's/>/\&gt;/g' \
        -e 's/^\*\s*\([^{]*\){\([^}]\+\)}\(.*\)$/    <a name="\2">\1\2\3<\/a>/' \
        -e 's/^\*\s*\(.*\)$/    <a name="\1">\1<\/a>/' \
        -e 's/\(<a name="\w*\)[^"]*/\L\1/' \
        -e 's/#{\([^}]\+\)}(\([^)]\+\))/<a href="\\HASH\\\1">\2<\/a>/g' \
        -e 's/#\([^{]*\){\([^}]\+\)}\(\w*\)/<a href="\\HASH\\\2">\1\2\3<\/a>/g' \
        -e 's/#\(\w\w*\)/<a href="\\HASH\\\1">\1<\/a>/g' \
        -e 's/\\HASH\\/#/g' \
        -e 's/\(<a href="#\w*\)[^"]*/\L\1/g' \
        -e 's/https\?:\/\/\S\S*/<a href="&">&<\/a>/g' \
        $1
}

updatehtml(){
    txt2html glossary.txt | sed -i '/<h1/r /dev/stdin' glossary.html
}

createhtml(){
    cat <<EOF
<!DOCTYPE HTML>
<html lang="de">
  <head>
    <meta charset="UTF-8">
    <title>Boules: Glossar</title>
    <link rel="stylesheet" href="../docstyle.css" />
  </head>
  <body class="glossary">
    <h1>Glossar</h1>
`txt2html glossary.txt`
</body>
</html>
EOF
}

updatehtml
