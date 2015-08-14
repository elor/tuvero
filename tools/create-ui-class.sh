#!/bin/bash
#
# creates a ui class

##########
# syntax #
##########

set -e -u

( (( ${#@} == 0 )) || [ -z "$1" ] || [ "$1" == "--help" ] || [ "$1" == "-help" ] || [ "$1" == "-h" ] ) && {
    cat >&2 <<EOF
Syntax: $0 ClassName

DESCRIPTION:

        Create a new class file inside legacy/scripts/ui, according to the ClassName.
        The ClassName is required to be in alpha-only upper camel case
EOF
    exit 1
}

##################
# initialization #
##################

class=$1
filename=`tr '[:upper:]' '[:lower:]' <<< $class`.js
coredir=core/scripts
dir=legacy/scripts/ui
fullpath=$dir/$filename
super=''
(( ${#@} > 1 )) && super=$2
[ -z "$super" ] && super=`grep -Po '[A-Z][a-z]+$' <<< $class`
superref=core/`tr '[:upper:]' '[:lower:]' <<< $super`
superpath=$coredir/`basename $superref.js`
gitauthor="$(git config user.name)"
gitemail="$(git config user.email)"

[ -z "$gitauthor" ] && { echo "error: git config: user.name missing">&2; exit 1; }
[ -z "$gitemail" ] && { echo "error: git config: user.email missing">&2; exit 1; }

#########################
# output for validation #
#########################

cat <<EOF
ClassName: $class
file path: $fullpath
path name: $dir
file name: $filename
superclass: $super
superref: $superref
author: $gitauthor
email: $gitemail

EOF

####################
# validation stuff #
####################

grep -P '([A-Z][a-z]+){2,}' &>/dev/null <<< $class || { echo "'$class' is not in CamelCase with two or more words" >&2; exit 1; }

[ -s $fullpath ] && {  echo "$fullpath already exists">&2; exit 1;}
[ -f $superpath ] || { echo "superclass file does not exist: $superpath">&2; exit 1; }

#####################################################
# read the constructor arguments of the super class #
#####################################################

superconstructor=$(grep '^\s*function\s'$super'\s*(' $superpath)

[ -z "$superconstructor" ] && { echo "superconstructor not found in file $superpath">&2; echo "This can also happen if it's malformed or spans across multiple lines">&2; exit 1; }

superarguments=$(sed -r -n 's ^\s*function\s'$super'\s*(\([^)]*\))\s*\{?\s*$ \1 p' <<< "$superconstructor")

[ -z "$superarguments" ] && { echo "cannot read superconstructor arguments. Are they malformed?">&2; exit 1; }

supercomma=', '
[ "$superarguments" == "()" ] && supercomma=''
superarguments=$(sed -n 's/^(\(.*\))$/\1/p' <<< "$superarguments")

[ -z "$superarguments" ] && [ -n "$supercomma" ] && { echo "unexpected error with superarguments. Please debug manually">&2; exit 1; }

####################
# writing the file #
####################

cat > $fullpath <<EOF
/**
 * $class
 * 
 * @return $class
 * @author $gitauthor <$gitemail>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', '$superref'], function(extend, $super){
  /**
   * Constructor
   */
  function $class($superarguments) {
    $class.superconstructor.call(this$supercomma$superarguments);
  }
  extend($class, $super);

  return $class;
});
EOF

echo
echo "$fullpath created:"
echo

cat "$fullpath"

make scripts
