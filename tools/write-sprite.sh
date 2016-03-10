#!/bin/bash
######################################################################
# combine all png and jpg images into a large png sprite             #
# The sprinte is not required to be as compact as possible.          #
# Since most files have the same height, this shouldn't be a problem #
# The idea is not to save disk space, but to reduce http calls       #
######################################################################

set -e -u

if (( ${#@} != 1 )); then
    echo "Syntax: $(basename $0) <target>"
    exit 1
fi

# validation
[[ "$1" =~ ^[a-z]+$ ]]
[ -d $1 ]
[ -d $1/images ]
[ -d $1/style ]

cd $1

which file >/dev/null || exit 1
which optipng >/dev/null || exit 1
which compare >/dev/null || exit 1
which convert >/dev/null || exit 1

listFiles(){
    grep -Poh 'data-(img|tab)="[^"]+"(?!\s*data-spriteignore)' *.html \
        | sed -r -e 's ^data-(img|tab)=" images/ ' -e 's "$ .png ' \
        | sort -u \
        | grep -v $finalsprite
}

coredir=../core/
sprite=images/sprite_new.png
finalsprite=images/sprite.png
rm -f $sprite

getSizes(){
    while IFS= read file; do

        [ "$file" == "$sprite" ] && continue;

        if ! [ -f "$file" ]; then
            if [ -f "$coredir$file" ]; then
                file="$coredir$file"
            else
                echo "cannot find $(basename "$file") under any of the following directories: ">&2
                echo "./$(dirname "$file")">&2
                echo "$coredir$(dirname "$file")">&2
                exit 1
            fi
        fi

        case $file in
            *.png)
                size=`file "$file" | sed -r -n "s!^$file: PNG image data, ([0-9]+) x ([0-9]+), .*!$file \1 \2!p"`
                if [ -n "$size" ]; then
                    echo "$size"
                else
                    echo "$file 128 128"
                    echo "cannot read size of $file. defaulting to 128x128">&2
                fi
                ;;
            *)
                echo "$file 128 128"
                echo "unsupported file type: $file" >&2
                ;;
        esac
    done
}

comparesprites(){

    # does the old sprite still exist?
    [ -f "$finalsprite" ] || return 1

    # file size and encoding comparison
    local oldinfo=$(file $finalsprite | cut -d: -f2-)
    local newinfo=$(file $sprite | cut -d: -f2-)
    echo "comparing file information"
    [ "$oldinfo" != "$newinfo" ] && return 1

    # pixel comparison (imagemagick compare with absolute error metric)
    local cmpresult=$(compare -metric ae $finalsprite $sprite /dev/null 2>&1 )
    echo "comparing imagemagick return value"
    [ $? != 0 ] && return 1
    echo "comparing pixel errors"
    [ "$cmpresult" != 0 ] && return 1

    return 0
}

files="`listFiles | getSizes`"
files="`sort -k3,3rn <<< "$files"`"
heights=(`cut -d ' ' -f 3 <<< "$files"`)
widths=(`cut -d ' ' -f 2 <<< "$files"`)
files=(`cut -d ' ' -f 1 <<< "$files"`)

maxheight=0
maxwidth=0
area=0
for i in `seq 0 $((${#files[@]}-1))`; do 
    width=${widths[i]} 
    height=${heights[i]}

    (( width > maxwidth )) && maxwidth=$width 
    (( height > maxheight )) && maxheight=$height

    let area=area+width*height

done

canvaswidth=`python -c "import math; print(max($maxwidth, int(2**math.ceil(math.log(math.sqrt($area), 2)))))"`

margin=1
y=$margin
x=$margin
nexty=$x
nextx=$y
stylesheet=style/sprite.css
> $stylesheet

compositecommand=""

xmax=0

for i in `seq 0 $((${#files[@]}-1))`; do
    file=${files[i]}
    echo "processing $file"
    width=${widths[i]} 
    height=${heights[i]}

    x=$nextx
    nextx=$(( x + width + margin ))
    nextx=$((nextx+4-nextx%4))

    if (( nextx >= canvaswidth )); then
        x=$margin
        y=$((nexty+4-nexty%4))
        nextx=$((width + margin))
        nextx=$((nextx+4-nextx%4))
    fi

    (( y + height + margin > nexty )) && nexty=$((y + height + margin))
    (( xmax > nextx )) || xmax=$nextx

    compositecommand="$compositecommand $file -geometry ${width}x${height}+${x}+${y} -composite"

    shortname=`sed -r 's:.*images/(.*).png:\1:' <<< "$file"`

    cat <<EOF >> $stylesheet
[data-img="$shortname"]::before {
    background-position: $((-x/2))px $((-y/2))px;
    width: $((width/2))px;
    height: $((height/2))px;
}

.tiny[data-img="$shortname"]::before {
    background-position: $((-x/4))px $((-y/4))px;
    width: $((width/4))px;
    height: $((height/4))px;
}

.large[data-img="$shortname"]::before {
    background-position: -${x}px -${y}px;
    width: ${width}px;
    height: ${height}px;
}

EOF

done

canvaswidth=$xmax
canvasheight=$nexty

cat <<EOF >> $stylesheet

[data-img="sprite"]::before {
    background-image: url("../$finalsprite");
    width: $((canvaswidth/2))px;
    height: $((canvasheight/2))px;
}

.tiny[data-img="sprite"]::before {
    background-image: url("../$finalsprite");
    width: $((canvaswidth/4))px;
    height: $((canvasheight/4))px;
}

.large[data-img="sprite"]::before {
    background-image: url("../$finalsprite");
    width: ${canvaswidth}px;
    height: ${canvasheight}px;
}

[data-img]::before {
  background-image: url("../$finalsprite");
  background-size: $((canvaswidth/2))px $((canvasheight/2))px;
  display: inline-block;
  vertical-align: bottom;
  content: '';
}

button[data-img]::before,
h2[data-img]::before,
.middle[data-img]::before {
  vertical-align: middle;
}

.large[data-img]::before {
  background-size: ${canvaswidth}px ${canvasheight}px;
}

.tiny[data-img]::before {
  background-size: $((canvaswidth/4))px $((canvasheight/4))px;;
}
EOF

###############################
# actually combine the images #
###############################

convert -quality 100 -size ${canvaswidth}x${canvasheight} xc:transparent $compositecommand $sprite || exit 1

######################
# compressing sprite #
######################
optipng -o3 $sprite

##################################################
# compare the sprites and overwrite if necessary #
##################################################
if comparesprites; then
    # equal
    rm -v $sprite
    cat <<EOF

No changes found.
EOF
else
    # different
    mv -v $sprite $finalsprite
    cat <<EOF

output: `getSizes <<< $finalsprite`
number of images: ${#files[@]}
input size: `cat ${files[@]} | wc -c` bytes
output size: `cat $finalsprite | wc -c` bytes

EOF
fi
