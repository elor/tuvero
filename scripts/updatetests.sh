#!/bin/bash
#
# update main.js to require all files in the directory

outfile="test.js"

pushd `dirname $0`

files=`echo ./*/test/*.js`
files=${files//.js/}
files=${files// /\', \'}

cat << EOF > $outfile
/**
* run all tests
* 
* this file is automatically created by updatetests.sh, located in the same folder. Do not attempt manual changes
*/

require([ '$files' ]);
EOF

cat $outfile

popd
