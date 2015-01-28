#!/bin/bash
#
# auto-generates a reference from the source code
# requires "cmark" to be installed for markdown conversion

refdir=doc/reference

listuserscripts(){
    listusersubscripts scripts
}

listusersubscripts(){
    dir=$1
    options=$2
    find $dir $options -type f -name '*.js' -not -path $dir/'lib/*' -not -path $dir/'lib/*/*' | sort
}

listscriptdirs(){
    listscriptsubdirs scripts
}

listscriptsubdirs(){
    dir=$1
    find $1 -type d -not -path $dir/lib -not -path $dir/'lib/*' | sort
}

listlibscripts(){
    find scripts/lib -type f -name '*.js' | sort
}

initerrors(){
    echo '```' > $refdir/errors.md
}

closeerrors(){
    echo '```' >> $refdir/errors.md
}

warning(){
    echo "Warning: $@" | tee -a $refdir/errors.md >&2
}

error(){
    echo "ERROR: $@" | tee -a $refdir/errors.md >&2
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
    script=$1
    warning "$script: no global comment"
    echo "No Description."
}

parsedependencies(){
    script=$1

    dependencies=$(sed -n '/define(/,/function/p' $script | tr "'" " " | xargs | grep -Po '\[[^\]]*\]' | grep -Po '(\.+/)*\w*(/\w*)*' | sort -h)
    dependencies=$(for dep in $dependencies; do
        if [[ "$dep" == lib/* ]]; then
            echo "* $dep"
        else
            echo "* <a href=\"$dep.html\">$dep</a>"
        fi
        done
    )
    grep -q '\$(' $script && dependencies="$dependencies
* JQuery
"

    threshold=5
    numdeps=`wc -l <<< "$dependencies"`
    (( numdeps > threshold )) && warning "$script: > $threshold dependencies: $numdeps"

    [ -z "$dependencies" ] && dependencies="No Dependencies"

    cat <<EOF
## Dependencies

$dependencies

EOF
}

formatfunctions(){
    sed -e '/\/\*\*/d' -e 's/.*\*\/.*/\n---\n/' -e 's/^\s*\*\s*//' -e '/function\s*\(\S\S*\s*\)\?(/ {s/^/### /;s/\s*{\s*$//}' -e 's/@return\s*/\n**Returns:** /' -e 's/@param\s\s*\(\S\S*\)\s*/**Argument:** **\1**\n/'
}

parsefunctions(){
    script=$1

    state=init

    functions=$(
        comment=""
        sed -r '0,/\*\//d' $script | grep -P '(?<!\()(?<![\(,]\s)(?<!return\s)function\s*(\S+\s*)?\(|define\s*\(|^\s*/?\*' | while IFS= read line; do

            # state transitions
            case $state in
                init)
                    if grep -q '^\s*/\*\*' <<< "$line"; then
                        state=comment
                    elif grep -q 'define\s*(' <<< "$line"; then
                        state=define
                        if grep -Pq 'function\s*(\S+\s*)?\(' <<< "$line"; then
                            state=idle
                        fi
                    elif grep -Pq 'function\s*(\S+\s*)?\(' <<< "$line"; then
                        warning "$script: function before define("
                        state=func
                    fi
                    ;;
                define)
                    if grep -q '^\s*/\*\*' <<< "$line"; then
                        state=comment
                    elif grep -Pq 'function\s*(\S+\s*)?\(' <<< "$line"; then
                        state=func
                    fi
                    ;;
                comment) 
                    if grep -q 'define\s*(' <<< "$line"; then
                        state=define 
                        if grep -Pq 'function\s*(\S+\s*)?\(' <<< "$line"; then
                            state=idle
                        fi
                    elif grep -Pq 'function\s*(\S+\s*)?\(' <<< "$line"; then
                        state=func
                    elif grep -q '^\s*/\*\*' <<< "$line"; then
                        comment=""
                    fi
                    ;;
                idle)
                    if grep -q '^\s*/\*\*' <<< "$line"; then
                        state=comment
                    elif grep -Pq 'function\s*(\S+\s*)?\(' <<< "$line"; then
                        state=func
                    fi
                    ;;
                *)
                    error "$script: unexpected state during function parsing: $state"
                    ;;
            esac

            # actual printing and logging
            case $state in
                func)
                    if [ -z "$comment" ]; then
                        comment="/**
*/"
                        warning "$script: undocumented: '`grep -Po '(\S+\s*[=:])?\s*function(\s*[^ \t(]+)?' <<< $line`'"
                    fi
                    cat <<EOF
$line
$comment
EOF
                    comment=""
                    state=idle
                    ;;
                comment)
                    comment="$comment$line
"
                    ;;
                *)
                    comment=""
            esac
        done 
    )

    numfuncs=`grep 'function' <<< "$functions" | wc -l`
    threshold=10
    (( numfuncs > threshold )) && warning "$script: > $threshold functions: $numfuncs"

    cat <<EOF
## Functions

$([ -n "$functions" ] && { echo -e "$functions" | formatfunctions; } || echo -e 'No exported functions')

EOF
}

printscriptmetrics(){
    script=$1

    lines=`cat $script | wc -l`
    size=`cat $script | wc -c`
    threshold=400

    (( lines > threshold )) && warning "$script: > $threshold lines: $lines"

    cat <<EOF
## Metrics

* $lines Lines
* $size Bytes

EOF
}

convertMD2HTML(){
    script=$1
    docfile=`getdocfile $script`
    docfiledir=`dirname $docfile`
    htmlfile=$docfiledir/`basename $docfile .md`.html

    cat <<EOF > $htmlfile
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>$script Reference</title>
</head>
<body>
<a href="`getrelhref index $docfiledir`">back to index</a>
<a href="index.html">Overview page</a>
$(cmark $docfile)
</body>
</html>
EOF
}

createoverviewpage(){
    scriptdir=$1
    docfile=`getdocfile $scriptdir/index`
    docfiledir=`dirname $docfile`
    docfile=$docfiledir/`basename $docfile .md`.html
    cat <<EOF > $docfile
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>$script Reference</title>
</head>
<body>
$(
    if [ "`readlink -f $docfiledir`" == "`readlink -f $refdir`" ]; then
        echo "<a href=\"errors.html\">Errors</a>"
    else
        echo "<a href=\"`getrelhref scripts/index $docfiledir`\">back to index</a>"
    fi
)
<a href="todo.html">TODO page</a>
<h1>$scriptdir/ Overview</h1>
<h2>Scripts</h2>
$(for script in `listusersubscripts $scriptdir "-maxdepth 1"`;do echo '<a href="'`getrelhref $script $docfiledir`'">'$script'</a><br>' ; done)
<h2>Subdirectories</h2>
$(for subdir in `listscriptsubdirs $scriptdir`; do echo '<a href="'`getrelhref $subdir/index $docfiledir`'">'$subdir/'</a><br>'; done)
</body>
</html>
EOF
}

createtodopage(){
    scriptdir=$1
    docfile=`getdocfile $scriptdir/todo`
    docfiledir=`dirname $docfile`
    docfile=$docfiledir/`basename $docfile .md`.html
    cat <<EOF > $docfile
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>$script Reference</title>
</head>
<body>
<a href="`getrelhref scripts/index $docfiledir`">back to index</a>
<a href="index.html">Overview page</a>
<h1>$scriptdir TODO Comments</h1>
$(grep -Pn 'TODO|FIXME|XXX' `listusersubscripts $scriptdir|xargs` | sed 's/^/* /' | cmark)
</body>
</html>
EOF
}

createrrorpage(){
    docfile=$refdir/errors.html

    closeerrors

    cat <<EOF > $docfile
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Errors</title>
</head>
<body>
<a href="index.html">back to index</a>
<h1>Code Style Warnings and Errors</h1>
`cmark $refdir/errors.md`
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
        printscriptmetrics $script
    } >> $docfile
    convertMD2HTML $script
}

mkdir $refdir
initerrors

echo "generating script references"
for script in `listuserscripts`; do
    processscript $script
done

echo "generating overview pages"
for dir in `listscriptdirs`; do
    createoverviewpage $dir
done

echo "generating todo pages"
for dir in `listscriptdirs`; do
    createtodopage $dir
done

echo "generating error page"
createrrorpage