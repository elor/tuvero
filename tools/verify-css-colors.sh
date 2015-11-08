#!/bin/bash
# 
# find all links in the html pages and warn if they're offline

set -e -u

findcolors(){
    find core/style/ legacy/style -name '*.css' | xargs grep -hiPo '#[0-9a-f]{3,6}' | sort | uniq -c
}

findcolors
