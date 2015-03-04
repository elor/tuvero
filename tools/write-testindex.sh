#!/bin/bash
#
# write the list of files to test/index.html

set -e -u

version=$(cat Version)

cd test/

qunit=$(grep -l 'id="qunit"' *.html | tail -1)

listviewtests(){
    ls *.html | grep -v '^'$qunit'$' | grep -v '^index.html$'
}

listlinks(){
    listviewtests | sed 's#.*#<a href="&">&</a><br>#'
}

cat <<EOF > index.html
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Tuvero Test $version</title>
</head>
<body>
<h1>Tuvero Test $version</h1>
<h2>Unit Tests</h2>
<a href="$qunit">$qunit</a>
<h2>View Tests</h2>
$(listlinks)
</body>
</html>
EOF
