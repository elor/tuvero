#!/bin/bash
#
# finds all occurences of "Strings." and "Strings[" and matches them against strings.json to see which strings are unused

git grep 'Strings\.' | grep -Po 'Strings\.[^); .,\]]*' | sed 's/^Strings\.//'
