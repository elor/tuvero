#!/bin/bash
###########################################################
# write license and author information to every code file #
###########################################################

listuserscripts(){
    find */scripts/ -type f -name '*.js' -not -name 'require.js' -not -name 'build.js' -not -name 'qunit.js'
}

for script in `listuserscripts`; do
    if [ "`head -n1 $script`" != "/**" ]; then
        sed -i '1i\
/**\
 * No Description\
 *\
 */\
' $script
    fi

    sed -r -i '0,/\*\// {/@(author|license|see)/d}' $script
    sed -r -i '0,/^\s*\*\// s/^\s*\*\// * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>\
 * @license MIT License\
 * @see LICENSE\
 *\//' $script
done
