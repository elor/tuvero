#!/bin/bash
#
# create the Version file

################################################
# get the current version from the branch name #
################################################
branch_name="$(git symbolic-ref HEAD 2>/dev/null)" || branch_name="(unnamed branch)"     # detached HEAD
branch_name=${branch_name##refs/heads/}
version=${branch_name##release-}

echo $version > Version

