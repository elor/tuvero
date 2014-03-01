#!/bin/bash
#
# update main.js to require all files in the directory

rm main.js
files=`echo $(ls *.js)`
files=${files//.js/}
files=${files// /\', \'}

echo -ne "require([ '$files' ]);" > main.js

cat main.js
