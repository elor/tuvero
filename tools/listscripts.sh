#!/bin/bash
#
# list all module script files in alphabetic order

find core/scripts/ legacy/scripts/ \
    -type f -name '*.js' \
    -not -path 'core/scripts/common.js' \
    -not -path 'core/scripts/config.js' \
    -not -path 'core/scripts/main.js' \
    | sort
