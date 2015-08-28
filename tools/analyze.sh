#!/bin/bash
#
# creates a plato directory with daily entries since the start of the tuvero repository

set -e -u

plato=~/node_modules/.bin/plato
outdir=../plato-tuvero

getcommits(){
    local commit=HEAD

    while true; do
        echo $commit
        commit=$(git rev-parse ${commit}^) || break
    done 2>/dev/null \
        | xargs git show -s --format='%ci %H' \
        | sort -k1,1 -u \
        | awk '{ print $4 }'
}

rm -rf $outdir/*

commits=$(getcommits)

for commit in $commits; do
    git checkout $commit

    jshint=""
    [ -f .jshintrc ] && jshint='-l .jshintrc'

    scripts=$(find * -name '*.js' | grep -v 'lib/' | grep -v 'test/')

    [ -z "$scripts" ] && continue

    $plato -d $outdir -t Tuvero -D $(git show -s --format=%ct $commit) -x 'qunit.*.js|require.*.js|build.js|jquery.*.js' $scripts
done
