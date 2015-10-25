#!/bin/bash
#
# creates a plato directory with daily entries since the start of the tuvero repository

set -e -u

plato=~/node_modules/.bin/plato
localrepo=../tuvero-gh-pages
outdir=$localrepo/plato
repo=git@github.com:elor/tuvero
branch=gh-pages

[ -f $plato ] || { echo "$plato does not exist">&2; exit 1; }
[ -x $plato ] || { echo "$plato is not an executable">&2; exit 1; }

downloadrepo(){
    rm -rf $localrepo
    git clone --depth=1 --branch $branch $repo $localrepo
}

getcommits(){
    local commit=develop

    while true; do
        echo $commit
        commit=$(git rev-parse ${commit}^) || break
    done 2>/dev/null \
        | xargs git show -s --format='%ci %H' \
        | sort -k1,1 -u \
        | awk '{ print $4 }'
}

getlastentry(){
    grep -o '"date":"[^"]*"' $outdir/report.history.js | tail -n 1 | grep -o '"[0-9].*"' | xargs date +%s -d
}

downloadrepo || { echo "download failed">&2; exit 1; }

commits=$(getcommits)
lastentrydate=$(getlastentry)

[ -z $lastentrydate ] && { echo "cannot read last entry date">&2; exit 1; }

for commit in $commits; do
    commitdate=$(git show -s --format=%ct $commit)
    (( "$commitdate" > "$lastentrydate" )) || continue

    git checkout -q $commit

    jshint=""
    [ -f .jshintrc ] && jshint='-l .jshintrc'

    scripts=$(find * -name '*.js' | grep -v 'lib/' | grep -v 'test/')
    [ -z "$scripts" ] && continue

    echo "analyzing $commit"

    $plato -d $outdir -t Tuvero -D $commitdate -x 'qunit.*.js|require.*.js|build.js|jquery.*.js' $scripts
done

git checkout -q develop

git -C $localrepo commit "plato update $(date +%F)"

echo "Done. Please check the results and upload with 'git -C $localrepo push'"