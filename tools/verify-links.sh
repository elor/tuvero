#!/bin/bash
# 
# find all links in the html pages and warn if they're offline

set -e -u

findurls(){
    find -name '*.html' | xargs grep -hPo 'https?://[^"<]+' | sort -u
}

urls=$(findurls)

success=true

for url in $urls; do
    echo -n "checking $url ... "
    if curl -s $url >/dev/null; then
        echo "[OK]"
    else
        echo
        echo "$url [OFFLINE]"
        success=false
    fi
done

$success
