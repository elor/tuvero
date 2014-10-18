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
        sed -n '1,/\*\//p' $script | stripcommentchars | {
            sed -r -e 's/@author\s*([^<]+)\s*(<([^>]+)>)/* Author: \1\
* Mail: <\3>/' -e 's/@license\s*(.*)/* License: \1/' -e '/@see/d' \
                -e 's/@exports\s*(.*)/* Exports: \1/' -e 's/@implements\s*(.*)/* Implements: \1/'
        }
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
    dependencies=$(sed -n '/define(/,/function/p' $script | tr "'" " " | xargs | grep -Po '\[[^\]]*\]' | grep -Po '(\.+/)*\w*(/\w*)*' | sort -h)
    dependencies=$(for dep in $dependencies; do
        if [[ "$dep" == lib/* ]]; then
            echo "* $dep"
        else
            echo "* <a href=\"$dep.html\">$dep</a>"
        fi
        done
    )
    [ -n "$dependencies" ] && echo -e "$dependencies" || echo "No Dependencies"
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
<a href="`getrelhref index $script`">back to index</a>
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
<a href="todo.html">TODO page</a>
<h1>Reference Overview</h1>
$(for script in `listuserscripts|sort`;do echo '<a href="'`getrelhref $script $refdir`'">'$script'</a><br>' ; done)
</body>
</html>
EOF
}

createtodopage(){
    cat <<EOF > $refdir/todo.html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>$script Reference</title>
</head>
<body>
<a href="index.html">back to index</a>
<h1>TODO Comments</h1>
$(grep -Pn 'TODO|FIXME|XXX' `listuserscripts|sort|xargs` | sed 's/^/* /' | stmd)
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

createtodopage

echo
echo "done"
