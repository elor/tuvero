#!/bin/bash
#
# auto-generates a reference from the source code
# requires "stmd" to be installed for markdown conversion

refdir=doc/reference

listuserscripts(){
    find scripts -type f -name '*.js' -not -path 'scripts/lib/*' -not -path 'scripts/lib/*/*'
}

listlibscripts(){
    find scripts/lib -type f -name '*.js'
}

warning(){
    echo "WARNING: $@" >&2
}

error(){
    echo "ERROR: $@" >&2
}

getdocfile(){
    script=${1##scripts/}
    echo $refdir/`dirname $script`/`basename $script .js`.md
}

getrelhref(){
    script=${1##scripts/}
    source=$2
    html=$refdir/`dirname $script`/`basename $script .js`.html
    python -c "import os.path; print(os.path.relpath('$html', '$source'))"
}

stripcommentchars(){
    sed -r 's_(^\s*/?\**/?\s?|\*+/\s*$)__'
}

initdocfile(){
    docfile=`getdocfile $1`
    mkdir -p `dirname $docfile`
    echo "# $script" > $docfile
}

parseglobalcomment(){
    script=$1

    echo
    if [ "`head -n1 $script`" != '/**' ]; then
        fakeglobalcomment $script
    else
        sed -n '1,/\*\//p' $script | stripcommentchars
    fi
    echo
}

fakeglobalcomment(){
    warning "no global comment: ${script##scripts/}"
    echo "No Description."
}

parsedependencies(){
    script=$1

    echo "## Dependencies"
    echo
    sed -n '/define(/,/function/p' $script | grep -Po '\[[^\]]*\]' | grep -Po '(\.+/)*\w*(/\w*)*' | sed 's/^/* /' | sort -h
    echo
}

parsefunctions(){
    script=$1

    echo "## Functions"
    echo
    grep -Pho '(\S*\s*=\s*function|function\s*\S+)\s*\([^)]*\)?' $script
    echo
}

parsereturnvalues(){
    script=$1
    
    echo "## Return Values"
    echo
    grep -Pho 'return\s+.*;' $script | sed 's/.*/* `&` /'
    echo
}

convertMD2HTML(){
    script=$1
    docfile=`getdocfile $script`

    (
        cd `dirname $docfile`
        cat <<EOF > `basename $docfile .md`.html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>$script Reference</title>
</head>
<body>
$(stmd `basename $docfile`)
</body>
</html>
EOF
    )
}

createoverviewpage(){
    cat <<EOF > $refdir/index.html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>$script Reference</title>
</head>
<body>
$(for script in `listuserscripts|sort`;do echo '<a href="'`getrelhref $script $refdir`'">'$script'</a><br>' ; done)
</body>
</html>
EOF
}

processscript(){
    script=$1
    initdocfile $script
    docfile=`getdocfile $script`
    {
        parseglobalcomment $script
        parsedependencies $script
        parsefunctions $script
        parsereturnvalues $script
    } >> $docfile
    convertMD2HTML $script
}

mkdir $refdir

for script in `listuserscripts`; do
    processscript $script
done

createoverviewpage

echo
echo "done"
